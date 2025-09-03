using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Products.Queries.GetProducts
{
    public class GetProductsHandler : IRequestHandler<GetProductsQuery, PaginatedResponse<GetProductsVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetProductsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResponse<GetProductsVM>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Products.AsNoTracking()
                .Where(x => 
                    (request.KaratTypeFilter == null || x.KaratType == request.KaratTypeFilter) &&
                    (request.WeightFilter == null || x.Weight == request.WeightFilter) &&
                    (request.ProductCategoryFilter == null || x.Category == request.ProductCategoryFilter)
                )
                .Select(x => new GetProductsVM
                {
                    Id = x.Id,
                    Sku = x.Sku,
                    Name = x.Name,
                    KaratType = x.KaratType,
                    Weight = x.Weight,
                    Category = x.Category,
                    Images = x.Images.Select(i => new ProductImageVM
                    {
                        ImageUrl = i.ImageUrl,
                    }).ToList()
                });

            if (!string.IsNullOrEmpty(request.SearchBy))
            {
                var keyword = request.SearchBy;
                KaratType karatType;
                decimal weight;
                


                if (Enum.TryParse(keyword.Replace(" ", ""), true, out karatType) && Enum.IsDefined(typeof(KaratType), karatType))
                {
                    query = query.Where(x => x.KaratType == karatType);
                }
                else if(decimal.TryParse(keyword, out weight))
                {
                    query = query.Where(x => x.Weight == weight);
                }
                else
                {
                    query = query.Where(x => x.Sku.Contains(request.SearchBy)
                            || x.Name!.Contains(request.SearchBy));
                }
            }

            var totalRecords = await query.CountAsync(cancellationToken);
            var data = await query
                .ApplySorting(request.SortBy!, request.SortDirection)
                .ApplyPagination(request.PageNumber, request.PageSize)
                .ToListAsync(cancellationToken);


            return new PaginatedResponse<GetProductsVM>
            {
                Data = data,
                TotalRecords = totalRecords,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                StatusCode = data.Count > 0 ? ResponseStatusCode.Success : ResponseStatusCode.NoContent,
            };

        }
    }
}
