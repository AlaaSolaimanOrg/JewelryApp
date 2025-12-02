using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Sales.Queries.GetSaleById;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Sales.Queries.SearchSales
{
    internal class SearchSalesHandler : IRequestHandler<SearchSalesQuery, PaginatedResponse<SearchSalesVM>>
    {
        private readonly IApplicationDbContext _context;

        public SearchSalesHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResponse<SearchSalesVM>> Handle(SearchSalesQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Sales.AsNoTracking().AsQueryable();

            // Apply filters if any search criteria is provided
            if (!string.IsNullOrWhiteSpace(request.SerialNumber))
            {
                query = query.Where(x => x.SerialNumber.Contains(request.SerialNumber));
            }

            if (!string.IsNullOrWhiteSpace(request.CustomerPhone))
            {
                query = query.Where(x => x.Customer!.PhoneNumber.Contains(request.CustomerPhone));
            }

            if (!string.IsNullOrWhiteSpace(request.CustomerName))
            {
                query = query.Where(x => x.Customer!.Name.Contains(request.CustomerName));
            }

            // Project to SearchSalesVM
            var salesQuery = query.Select(x => new SearchSalesVM
            {
                Id = x.Id,
                SerialNumber = x.SerialNumber,
                CreatedDate = x.CreatedDate,
                StaffName = x.CreatedByUser!.FullName!,
                CustomerName = x.Customer!.Name,
                CustomerPhone = x.Customer!.PhoneNumber,
                Total = x.Total,
                CashAmount = x.CashAmount,
                CardAmount = x.CardAmount,
                Discount = x.Discount,
                SaleItems = x.SaleItems.Select(i => new SaleItemVM
                {
                    Id = i.Id,
                    ProductName = i.Product!.Name!,
                    ProductImage = i.Product.Images!.Where(im => im.IsMain).Select(im => im.ImageUrl).FirstOrDefault()!,
                    Sku = i.Product.Sku,
                    Karat = i.KaratType,
                    Weight = i.Weight,
                    PricePerGram = i.OverriddenPricePerGram ?? i.OriginalPricePerGram,
                    Subtotal = i.SubTotal -
                                (x.Discount ?? 0) * (x.SubTotal > 0 ? i.SubTotal / x.SubTotal : 0),
                    Quantity = i.Quantity,                    
                }).ToList(),
            });

            var totalRecords = await salesQuery.CountAsync(cancellationToken);

            var sales = await salesQuery
                .ApplySorting(request.SortBy ?? "CreatedDate", request.SortDirection)
                .ApplyPagination(request.PageNumber, request.PageSize)
                .ToListAsync(cancellationToken);

            // Calculate total return amount for each sale
            foreach (var sale in sales)
            {
                sale.TotalReturnAmount = sale.SaleItems.Any(i => i.AmountReturned > 0)
                    ? sale.SaleItems.Sum(i => i.AmountReturned)
                    : null;
            }

            return new PaginatedResponse<SearchSalesVM>
            {
                Data = sales,
                Message = Messages.Success,
                TotalRecords = totalRecords,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                StatusCode = sales.Any() ? ResponseStatusCode.Success : ResponseStatusCode.NoContent
            };
        }
    }
}
