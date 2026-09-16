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

namespace JewerlyApp.Application.Customers.Queries.GetCustomerActivityStats
{
    public class GetCustomerActivityStatsHandler : IRequestHandler<GetCustomerActivityStatsQuery, GenericResponse<CustomerActivityStatsVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetCustomerActivityStatsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<CustomerActivityStatsVM>> Handle(GetCustomerActivityStatsQuery request, CancellationToken cancellationToken)
        {
            var salesQuery = _context.Sales.AsQueryable();

            if (request.DateFrom.HasValue)
            {
                salesQuery = salesQuery.Where(s => s.CreatedDate >= request.DateFrom.Value);
            }

            if (request.DateTo.HasValue)
            {
                salesQuery = salesQuery.Where(s => s.CreatedDate <= request.DateTo.Value);
            }

            var salesInRange = await salesQuery
                .Select(s => new { s.CustomerId, s.Total, s.Discount, s.SubTotal })
                .ToListAsync(cancellationToken);

            var customerIds = salesInRange.Select(s => s.CustomerId).Distinct().ToList();

            // A customer's global first-ever sale date decides whether their revenue in
            // this window counts as "new" (first purchase on/after the window start) or
            // "returning" (they'd already bought before the window began).
            var firstSaleDates = await _context.Sales
                .AsNoTracking()
                .Where(s => customerIds.Contains(s.CustomerId))
                .GroupBy(s => s.CustomerId)
                .Select(g => new { CustomerId = g.Key, First = g.Min(s => s.CreatedDate) })
                .ToDictionaryAsync(g => g.CustomerId, g => g.First, cancellationToken);

            bool IsNewCustomer(Guid customerId) =>
                !request.DateFrom.HasValue ||
                (firstSaleDates.TryGetValue(customerId, out var first) && first.HasValue && first.Value >= request.DateFrom.Value);

            var revenue = salesInRange.Sum(s => s.Total);
            var newRevenue = salesInRange.Where(s => IsNewCustomer(s.CustomerId)).Sum(s => s.Total);

            var discounts = salesInRange
                .Select(s => s.SubTotal > 0 ? (s.Discount ?? 0) / s.SubTotal * 100 : 0)
                .ToList();

            var newCustomers = customerIds.Count(IsNewCustomer);

            var vm = new CustomerActivityStatsVM
            {
                Active = customerIds.Count,
                NewCustomers = newCustomers,
                Revenue = revenue,
                NewRevenue = newRevenue,
                ReturningRevenue = revenue - newRevenue,
                AvgDiscount = discounts.Count > 0 ? discounts.Average() : 0,
            };

            return new GenericResponse<CustomerActivityStatsVM>
            {
                Data = vm,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
