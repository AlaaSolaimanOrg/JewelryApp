using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Customers.Queries.GetCustomerBaseStats
{
    public class GetCustomerBaseStatsHandler : IRequestHandler<GetCustomerBaseStatsQuery, GenericResponse<CustomerBaseStatsVM>>
    {
        // "Going quiet" = a high-value customer with no purchase in a while.
        // No configurable threshold exists in the data model, so these are fixed here.
        private const decimal HighValueThreshold = 8000m;
        private const int QuietDaysThreshold = 90;

        private readonly IApplicationDbContext _context;

        public GetCustomerBaseStatsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<CustomerBaseStatsVM>> Handle(GetCustomerBaseStatsQuery request, CancellationToken cancellationToken)
        {
            var totalCustomers = await _context.Customers.AsNoTracking().CountAsync(c => c.IsActive, cancellationToken);

            var salesByCustomer = await _context.Sales
                .AsNoTracking()
                .GroupBy(s => s.CustomerId)
                .Select(g => new
                {
                    CustomerId = g.Key,
                    Total = g.Sum(s => s.Total),
                    Count = g.Count(),
                    FirstDate = g.Min(s => s.CreatedDate),
                    LastDate = g.Max(s => s.CreatedDate),
                })
                .ToListAsync(cancellationToken);

            var today = BusinessTimeZoneHelper.GetEdmontonDate();
            var currentYear = today.Year;

            var totalRevenueAllTime = salesByCustomer.Sum(s => s.Total);
            var newThisYear = salesByCustomer.Count(s =>
                s.FirstDate.HasValue && BusinessTimeZoneHelper.ConvertUtcToEdmonton(s.FirstDate.Value).Year == currentYear);
            var repeatCount = salesByCustomer.Count(s => s.Count > 1);
            var goingQuiet = salesByCustomer.Count(s =>
                s.Total >= HighValueThreshold &&
                s.LastDate.HasValue &&
                (today.DayNumber - DateOnly.FromDateTime(BusinessTimeZoneHelper.ConvertUtcToEdmonton(s.LastDate.Value)).DayNumber) >= QuietDaysThreshold);

            var vm = new CustomerBaseStatsVM
            {
                TotalCustomers = totalCustomers,
                NewThisYear = newThisYear,
                RepeatRate = totalCustomers > 0 ? (int)Math.Round(repeatCount * 100m / totalCustomers) : 0,
                RepeatCount = repeatCount,
                AvgLifetimeValue = totalCustomers > 0 ? totalRevenueAllTime / totalCustomers : 0,
                GoingQuiet = goingQuiet,
            };

            return new GenericResponse<CustomerBaseStatsVM>
            {
                Data = vm,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
