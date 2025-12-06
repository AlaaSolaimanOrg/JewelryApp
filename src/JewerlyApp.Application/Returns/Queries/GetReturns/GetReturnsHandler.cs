using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Logs.Queries.GetLogs;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Returns.Queries.GetReturns
{
    public class GetReturnsHandler :
        IRequestHandler<GetReturnsQuery, PaginatedResponse<ReturnResponseDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetReturnsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResponse<ReturnResponseDto>> Handle(
            GetReturnsQuery request,
            CancellationToken cancellationToken)
        {
            var query = _context.Returns
                .Include(r => r.Items)
                    .ThenInclude(i => i.SaleItem)
                        .ThenInclude(si => si.Product)
                .Include(r => r.Sale)
                    .ThenInclude(s => s.Customer)
                .AsQueryable();

            // --------------------------------------------
            // 🔍 SEARCH: customer name, phone, or receipt
            // --------------------------------------------
            if (!string.IsNullOrWhiteSpace(request.SearchBy))
            {
                string search = request.SearchBy.ToLower();

                bool isNumber = decimal.TryParse(request.SearchBy, out var numValue);

                query = query.Where(r =>

                    // ------------------------------------
                    // STRING SEARCH
                    // ------------------------------------
                    (
                        r.Sale.Customer.Name.ToLower().Contains(search) ||
                        r.Sale.Customer.PhoneNumber.Contains(search) ||
                        r.Sale.SerialNumber.ToLower().Contains(search) ||

                        // product text fields
                        r.Items.Any(i =>
                            i.SaleItem.Product.Name.ToLower().Contains(search) ||
                            i.SaleItem.Product.Sku.ToLower().Contains(search) ||
                            (i.ReasonNote != null && i.ReasonNote.ToLower().Contains(search))
                        )
                    )

                    ||

                    // ------------------------------------
                    // NUMERIC SEARCH (exact match)
                    // ------------------------------------
                    (
                        isNumber && (
                            r.TotalAmount == numValue ||
                            r.Items.Any(i =>
                                i.QuantityReturned == numValue ||
                                i.ReturnAmount == numValue ||
                                i.SaleItem.Product.Weight == numValue
                            )
                        )
                    )
                );
            }

            // --------------------------------------------
            // 🔀 FILTER BY RETURN OPTION
            // --------------------------------------------
            if (request.ReturnOption != null)
            {
                query = query.Where(r =>
                    r.Items.Any(i => i.Option == request.ReturnOption)
                );
            }

            // --------------------------------------------
            // 📦 PAGINATION
            // --------------------------------------------
            int totalRecords = await query.CountAsync(cancellationToken);

            var data = await query
              .ApplySorting(request.SortBy, request.SortDirection)
              .ApplyPagination(request.PageNumber, request.PageSize)
              .ToListAsync(cancellationToken);


            // --------------------------------------------
            // 🧩 MAP ENTITIES TO DTOs
            // --------------------------------------------
            var responseData = data.Select(r => new ReturnResponseDto
            {
                Id = r.Id,
                SaleId = r.SaleId,

                SaleSerialNumber = r.Sale.SerialNumber,
                CustomerName = r.Sale.Customer?.Name!,
                CustomerPhone = r.Sale.Customer?.PhoneNumber,

                ReturnDate = r.CreatedDate,
                TotalAmountReturned = r.TotalAmount,

                Items = r.Items.Select(i => new ReturnItemResponseDto
                {
                    Id = i.Id,
                    SaleItemId = i.SaleItemId,
                    ProductName = i.SaleItem.Product.Name,
                    Sku = i.SaleItem.Product.Sku,
                    Karat = i.SaleItem.Product.KaratType,
                    Weight = i.SaleItem.Product.Weight,
                    QuantityReturned = i.QuantityReturned,
                    AmountReturned = i.ReturnAmount,
                    Reason = i.Reason,
                    ReasonNote = i.ReasonNote,
                    Condition = i.Condition,
                    Option = i.Option,
                    ProductImage = i.SaleItem.Product.Images.FirstOrDefault()?.ImageUrl
                }).ToList()
            }).ToList();

            return new PaginatedResponse<ReturnResponseDto>
            {
                Data = responseData,
                Message = Messages.LogsRetrievedSuccessfully,
                TotalRecords = totalRecords,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                StatusCode = responseData.Any() ? ResponseStatusCode.Success : ResponseStatusCode.NoContent
            };

       
        }
    }
}
