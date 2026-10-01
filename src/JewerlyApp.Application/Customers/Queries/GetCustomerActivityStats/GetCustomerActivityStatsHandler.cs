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
            var salesQuery = _context.Sales.AsNoTracking();

            if (request.DateFrom.HasValue)
            {
                salesQuery = salesQuery.Where(s => s.CreatedDate >= request.DateFrom.Value);
            }

            if (request.DateTo.HasValue)
            {
                salesQuery = salesQuery.Where(s => s.CreatedDate <= request.DateTo.Value);
            }

            var firstSales = _context.Sales
                .AsNoTracking()
                .GroupBy(s => s.CustomerId)
                .Select(g => new { CustomerId = g.Key, First = g.Min(s => s.CreatedDate) });

            var totals = await salesQuery
                .Join(firstSales, s => s.CustomerId, f => f.CustomerId, (s, f) => new
                {
                    s.Total,
                    NewTotal = s.CreatedDate == f.First ? s.Total : 0m,
                    DiscountPct = s.SubTotal > 0 ? (s.Discount ?? 0) / s.SubTotal * 100 : 0m,
                })
                .GroupBy(_ => 1)
                .Select(g => new
                {
                    Revenue = g.Sum(x => x.Total),
                    NewRevenue = g.Sum(x => x.NewTotal),
                    AvgDiscount = g.Average(x => x.DiscountPct),
                })
                .FirstOrDefaultAsync(cancellationToken);

            var active = await salesQuery
                .Select(s => s.CustomerId)
                .Distinct()
                .CountAsync(cancellationToken);

            var newCustomersQuery = firstSales;

            if (request.DateFrom.HasValue)
            {
                newCustomersQuery = newCustomersQuery.Where(f => f.First >= request.DateFrom.Value);
            }

            if (request.DateTo.HasValue)
            {
                newCustomersQuery = newCustomersQuery.Where(f => f.First <= request.DateTo.Value);
            }

            var newCustomers = await newCustomersQuery.CountAsync(cancellationToken);

            var revenue = totals?.Revenue ?? 0;
            var newRevenue = totals?.NewRevenue ?? 0;

            var vm = new CustomerActivityStatsVM
            {
                Active = active,
                NewCustomers = newCustomers,
                Revenue = revenue,
                NewRevenue = newRevenue,
                ReturningRevenue = revenue - newRevenue,
                AvgDiscount = totals?.AvgDiscount ?? 0,
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
