using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetSoldItems
{
    internal class GetSoldItemsHandler : IRequestHandler<GetSoldItemsQuery, PaginatedResponse<GetSoldItemsVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetSoldItemsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResponse<GetSoldItemsVM>> Handle(GetSoldItemsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.SaleItems
                .AsNoTracking()
                .Include(si => si.Product)
                .Include(si => si.Sale)
                    .ThenInclude(s => s!.Customer)
                .AsQueryable();

            if (request.CategoryFilter != null)
                query = query.Where(si => si.Product!.Category == request.CategoryFilter);

            if (request.KaratFilter != null)
                query = query.Where(si => si.KaratType == request.KaratFilter);

            if (request.DateFrom.HasValue)
                query = query.Where(si => si.CreatedDate >= request.DateFrom.Value);

            if (request.DateTo.HasValue)
                query = query.Where(si => si.CreatedDate <= request.DateTo.Value);

            if (!string.IsNullOrWhiteSpace(request.SearchBy))
            {
                var keyword = request.SearchBy.Trim();
                query = query.Where(si =>
                    (si.Product != null && si.Product.Sku != null && si.Product.Sku.Contains(keyword)) ||
                    (si.Product != null && si.Product.Name != null && si.Product.Name.Contains(keyword)) ||
                    (si.Sale != null && si.Sale.Customer != null && si.Sale.Customer.Name.Contains(keyword)) ||
                    (si.Sale != null && si.Sale.SerialNumber.Contains(keyword)));
            }

            var totalRecords = await query.CountAsync(cancellationToken);

            var sortBy = string.IsNullOrWhiteSpace(request.SortBy) ? "CreatedDate" : request.SortBy;

            var result = await query
                .ApplySorting(sortBy, request.SortDirection)
                .ApplyPagination(request.PageNumber, request.PageSize)
                .Select(si => new GetSoldItemsVM
                {
                    Sku = si.Product!.Sku,
                    ProductName = si.Product!.Name!,
                    CustomerName = si.Sale!.Customer!.Name,
                    SaleSerialNumber = si.Sale!.SerialNumber,
                    Quantity = si.Quantity,
                    UnitWeight = si.Weight,
                    WeightSummed = si.Weight * si.Quantity,
                    PricePerGram = si.OverriddenPricePerGram ?? si.OriginalPricePerGram ?? 0,
                    Subtotal = si.SubTotal,
                    LatestSaleDate = si.CreatedDate ?? System.DateTime.UtcNow
                })
                .ToListAsync(cancellationToken);

            return new PaginatedResponse<GetSoldItemsVM>
            {
                Data = result,
                StatusCode = Domain.Enums.ResponseStatusCode.Success,
                Message = Messages.Success,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = totalRecords,
            };
        }
    }
}