using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Customers.Queries.GetTopCustomersReport
{
    public class GetTopCustomersReportHandler : IRequestHandler<GetTopCustomersReportQuery, PaginatedResponse<CustomerReportRowVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetTopCustomersReportHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResponse<CustomerReportRowVM>> Handle(GetTopCustomersReportQuery request, CancellationToken cancellationToken)
        {
            var range = request.ResolveDateRange();

            var salesQuery = _context.Sales.AsQueryable();

            if (range.StartUtc.HasValue)
            {
                salesQuery = salesQuery.Where(s => s.CreatedDate >= range.StartUtc.Value);
            }

            if (range.EndUtc.HasValue)
            {
                salesQuery = salesQuery.Where(s => s.CreatedDate <= range.EndUtc.Value);
            }

            var itemsQuery = _context.SaleItems.AsQueryable();

            if (range.StartUtc.HasValue)
            {
                itemsQuery = itemsQuery.Where(si => si.Sale!.CreatedDate >= range.StartUtc.Value);
            }

            if (range.EndUtc.HasValue)
            {
                itemsQuery = itemsQuery.Where(si => si.Sale!.CreatedDate <= range.EndUtc.Value);
            }

            var grouped = salesQuery
                .GroupBy(s => s.CustomerId)
                .Select(g => new
                {
                    CustomerId = g.Key,
                    Purchases = g.Count(),
                    Spent = g.Sum(s => s.Total),
                    AvgDiscount = g.Average(s => s.SubTotal > 0 ? (s.Discount ?? 0) / s.SubTotal * 100 : 0),
                });

            var customers = _context.Customers.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.SearchBy))
            {
                var search = request.SearchBy.Trim();
                var searchDigits = new string(search.Where(char.IsDigit).ToArray());
                customers = customers.Where(c =>
                    c.Name.Contains(search) ||
                    (searchDigits.Length > 0 && c.PhoneNumber
                        .Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "").Replace("+", "").Replace(".", "")
                        .Contains(searchDigits)));
            }

            // "Last purchase" reflects the customer's true most-recent sale, not just
            // their most-recent sale within this period's filter.
            var rows = grouped
                .Join(customers, g => g.CustomerId, c => c.Id, (g, c) => new CustomerReportRowVM
                {
                    Name = c.Name,
                    Phone = c.PhoneNumber,
                    Purchases = g.Purchases,
                    Items = itemsQuery.Where(si => si.Sale!.CustomerId == c.Id).Sum(si => (int?)si.Quantity) ?? 0,
                    Spent = g.Spent,
                    AvgDiscount = g.AvgDiscount,
                    Since = c.CreatedDate,
                    LastPurchase = _context.Sales.Where(s => s.CustomerId == c.Id).Max(s => s.CreatedDate),
                });

            var totalRecords = await rows.CountAsync(cancellationToken);

            var sortBy = string.IsNullOrWhiteSpace(request.SortBy) ? nameof(CustomerReportRowVM.Spent) : request.SortBy;
            var sortDirection = string.IsNullOrWhiteSpace(request.SortBy) ? SortDirection.Descending : request.SortDirection;

            var paged = await rows
                .ApplySorting(sortBy, sortDirection)
                .ApplyPagination(request.PageNumber, request.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResponse<CustomerReportRowVM>
            {
                Data = paged,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = totalRecords,
            };
        }
    }
}
