using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Sales.Commands.CreateSale;
using JewerlyApp.Application.Sales.Queries.GetSalesList;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
            var query = _context.SaleItems.AsQueryable();

            if(request.CategoryFilter != null)
            {
                query = query.Where(s => s.Product!.Category == request.CategoryFilter);
            }

            if (request.KaratFilter != null)
            {
                query = query.Where(s => s.KaratType == request.KaratFilter);
            }

            // Apply date range filter
            if (request.DateFrom.HasValue)
            {
                query = query.Where(s => s.CreatedDate >= request.DateFrom.Value);
            }

            if (request.DateTo.HasValue)
            {
                query = query.Where(s => s.CreatedDate <= request.DateTo.Value);
            }

            var query2 = query
                .Include(si => si.Product)
                .GroupBy(si => new
                {
                    si.ProductId,
                    ProductName = si.Product!.Name,
                    si.KaratType,
                    si.Weight,
                    PricePerGram = si.OverriddenPricePerGram ?? si.OriginalPricePerGram ?? 0
                })
                .Select(g => new GetSoldItemsVM
                {
                    ProductName = g.Key.ProductName!,
                    Quantity = g.Count(),
                    UnitWeight = g.Key.Weight,
                    WeightSummed = g.Sum(si => si.Weight),
                    PricePerGram = g.Key.PricePerGram,
                    Subtotal = g.Sum(si => si.SubTotal),
                    LatestSaleDate = (DateTime)g.Max(si => si.CreatedDate)!
                });

            if (string.IsNullOrEmpty(request.SortBy))
            {
                query2 = query2.OrderByDescending(s => s.LatestSaleDate);
            }

            var totalRecords = await query2.CountAsync(cancellationToken);

            var result = await query2.ApplySorting(request.SortBy!, request.SortDirection)
                .ApplyPagination(request.PageNumber, request.PageSize)
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
