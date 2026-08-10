using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Returns.Queries.GetReturnItems
{
    internal class GetReturnItemsHandler : IRequestHandler<GetReturnItemsQuery, PaginatedResponse<ReturnItemFlatDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetReturnItemsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResponse<ReturnItemFlatDto>> Handle(GetReturnItemsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.ReturnItems
                .Include(i => i.Return)
                    .ThenInclude(r => r.Sale)
                        .ThenInclude(s => s.Customer)
                .Include(i => i.SaleItem)
                    .ThenInclude(si => si.Product)
                        .ThenInclude(p => p.Images)
                .AsQueryable();

            // --------------------------------------------
            // 🔀 FILTER BY VIEW (tab)
            // --------------------------------------------
            query = request.View switch
            {
                ReturnItemsView.NeedsTags => query.Where(i => !i.IsTagPrinted && i.Option == ReturnOption.ReturnToStock),
                ReturnItemsView.Printed => query.Where(i => i.IsTagPrinted),
                _ => query,
            };

            // --------------------------------------------
            // 🔍 SEARCH: item, sku, customer, receipt
            // --------------------------------------------
            if (!string.IsNullOrWhiteSpace(request.SearchBy))
            {
                var search = request.SearchBy.ToLower();

                query = query.Where(i =>
                    i.SaleItem.Product.Name.ToLower().Contains(search) ||
                    (i.SaleItem.Product.Sku != null && i.SaleItem.Product.Sku.ToLower().Contains(search)) ||
                    i.Return.Sale.Customer.Name.ToLower().Contains(search) ||
                    i.Return.Sale.Customer.PhoneNumber.Contains(search) ||
                    i.Return.Sale.SerialNumber.ToLower().Contains(search)
                );
            }

            // --------------------------------------------
            // 📦 PAGINATION
            // --------------------------------------------
            var totalRecords = await query.CountAsync(cancellationToken);

            var sortBy = string.IsNullOrWhiteSpace(request.SortBy) ? "CreatedDate" : request.SortBy;

            var data = await query
                .ApplySorting(sortBy, request.SortDirection)
                .ApplyPagination(request.PageNumber, request.PageSize)
                .ToListAsync(cancellationToken);

            var responseData = data.Select(i => new ReturnItemFlatDto
            {
                Id = i.Id,
                ProductName = i.SaleItem.Product.Name,
                Sku = i.SaleItem.Product.Sku,
                Karat = i.SaleItem.Product.KaratType,
                Weight = i.SaleItem.Product.Weight,
                QuantityReturned = i.QuantityReturned,
                AmountReturned = i.ReturnAmount,
                ProductImage = i.SaleItem.Product.Images.FirstOrDefault(im => im.IsMain)?.ImageUrl
                    ?? i.SaleItem.Product.Images.FirstOrDefault()?.ImageUrl,

                Reason = i.Reason,
                ReasonNote = i.ReasonNote,
                Condition = i.Condition,
                Option = i.Option,

                CustomerName = i.Return.Sale.Customer?.Name ?? string.Empty,
                CustomerPhone = i.Return.Sale.Customer?.PhoneNumber,
                SaleSerialNumber = i.Return.Sale.SerialNumber,
                ReturnDate = i.CreatedDate,

                IsTagPrinted = i.IsTagPrinted,
                TagPrintedDate = i.TagPrintedDate,
            }).ToList();

            return new PaginatedResponse<ReturnItemFlatDto>
            {
                Data = responseData,
                Message = Messages.Success,
                TotalRecords = totalRecords,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                StatusCode = responseData.Any() ? ResponseStatusCode.Success : ResponseStatusCode.NoContent
            };
        }
    }
}
