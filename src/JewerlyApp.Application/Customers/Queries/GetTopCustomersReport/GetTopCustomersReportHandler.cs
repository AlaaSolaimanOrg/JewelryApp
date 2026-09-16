using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Customers.Queries.GetTopCustomersReport
{
    public class GetTopCustomersReportHandler : IRequestHandler<GetTopCustomersReportQuery, GenericResponse<List<CustomerReportRowVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetTopCustomersReportHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<CustomerReportRowVM>>> Handle(GetTopCustomersReportQuery request, CancellationToken cancellationToken)
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
                .Select(s => new
                {
                    s.CustomerId,
                    s.Total,
                    s.Discount,
                    s.SubTotal,
                    ItemCount = s.SaleItems.Sum(si => si.Quantity),
                })
                .ToListAsync(cancellationToken);

            if (salesInRange.Count == 0)
            {
                return new GenericResponse<List<CustomerReportRowVM>>
                {
                    Data = new List<CustomerReportRowVM>(),
                    StatusCode = ResponseStatusCode.Success,
                    Message = Messages.Success,
                };
            }

            var grouped = salesInRange
                .GroupBy(s => s.CustomerId)
                .Select(g => new
                {
                    CustomerId = g.Key,
                    Purchases = g.Count(),
                    Items = g.Sum(s => s.ItemCount),
                    Spent = g.Sum(s => s.Total),
                    AvgDiscount = g.Average(s => s.SubTotal > 0 ? (s.Discount ?? 0) / s.SubTotal * 100 : 0),
                })
                .ToList();

            var customerIds = grouped.Select(g => g.CustomerId).ToList();

            var customerInfo = await _context.Customers
                .AsNoTracking()
                .Where(c => customerIds.Contains(c.Id))
                .Select(c => new { c.Id, c.Name, c.PhoneNumber, c.CreatedDate })
                .ToDictionaryAsync(c => c.Id, cancellationToken);

            // "Last purchase" reflects the customer's true most-recent sale, not just
            // their most-recent sale within this period's filter.
            var lastPurchaseDates = await _context.Sales
                .AsNoTracking()
                .Where(s => customerIds.Contains(s.CustomerId))
                .GroupBy(s => s.CustomerId)
                .Select(g => new { CustomerId = g.Key, Last = g.Max(s => s.CreatedDate) })
                .ToDictionaryAsync(g => g.CustomerId, g => g.Last, cancellationToken);

            IEnumerable<CustomerReportRowVM> rows = grouped.Select(g =>
            {
                customerInfo.TryGetValue(g.CustomerId, out var info);
                lastPurchaseDates.TryGetValue(g.CustomerId, out var lastPurchase);

                return new CustomerReportRowVM
                {
                    Name = info?.Name ?? "—",
                    Phone = info?.PhoneNumber ?? "",
                    Purchases = g.Purchases,
                    Items = g.Items,
                    Spent = g.Spent,
                    AvgDiscount = g.AvgDiscount,
                    Since = info?.CreatedDate,
                    LastPurchase = lastPurchase,
                };
            });

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var search = request.Search.Trim().ToLowerInvariant();
                var searchDigits = new string(search.Where(char.IsDigit).ToArray());
                rows = rows.Where(r =>
                    r.Name.ToLowerInvariant().Contains(search) ||
                    (searchDigits.Length > 0 && new string(r.Phone.Where(char.IsDigit).ToArray()).Contains(searchDigits)));
            }

            var sorted = rows.OrderByDescending(r => r.Spent).ToList();

            return new GenericResponse<List<CustomerReportRowVM>>
            {
                Data = sorted,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
