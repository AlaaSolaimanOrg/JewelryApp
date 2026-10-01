using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Customers.Queries.GetAtRiskCustomers
{
    public class GetAtRiskCustomersHandler : IRequestHandler<GetAtRiskCustomersQuery, GenericResponse<List<AtRiskCustomerVM>>>
    {
        // Same "high value, gone quiet" definition used for the base-stats going-quiet count.
        private const decimal HighValueThreshold = 8000m;
        private const int QuietDaysThreshold = 90;
        private const int MaxResults = 20;

        private readonly IApplicationDbContext _context;

        public GetAtRiskCustomersHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<AtRiskCustomerVM>>> Handle(GetAtRiskCustomersQuery request, CancellationToken cancellationToken)
        {
            var salesByCustomer = await _context.Sales
                .AsNoTracking()
                .GroupBy(s => s.CustomerId)
                .Select(g => new
                {
                    CustomerId = g.Key,
                    Total = g.Sum(s => s.Total),
                    Count = g.Count(),
                    LastDate = g.Max(s => s.CreatedDate),
                })
                .Where(g => g.Total >= HighValueThreshold && g.LastDate != null)
                .ToListAsync(cancellationToken);

            var today = BusinessTimeZoneHelper.GetEdmontonDate();

            var atRisk = salesByCustomer
                .Select(s => new
                {
                    s.CustomerId,
                    s.Total,
                    s.Count,
                    DaysSince = today.DayNumber - DateOnly.FromDateTime(BusinessTimeZoneHelper.ConvertUtcToEdmonton(s.LastDate!.Value)).DayNumber,
                })
                .Where(s => s.DaysSince >= QuietDaysThreshold)
                .ToList();

            var customerIds = atRisk.Select(a => a.CustomerId).ToList();
            var names = await _context.Customers
                .AsNoTracking()
                .Where(c => customerIds.Contains(c.Id))
                .ToDictionaryAsync(c => c.Id, c => c.Name, cancellationToken);

            var rows = atRisk
                .OrderByDescending(a => a.Total)
                .Take(MaxResults)
                .Select(a => new AtRiskCustomerVM
                {
                    Name = names.GetValueOrDefault(a.CustomerId, "—"),
                    Lifetime = a.Total,
                    Purchases = a.Count,
                    DaysSinceLastPurchase = a.DaysSince,
                })
                .ToList();

            return new GenericResponse<List<AtRiskCustomerVM>>
            {
                Data = rows,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
