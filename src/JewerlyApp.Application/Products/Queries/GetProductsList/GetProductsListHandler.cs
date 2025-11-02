using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
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
    public class GetProductsListHandler : IRequestHandler<GetProductsListQuery, PaginatedResponse<GetProductsVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetProductsListHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResponse<GetProductsVM>> Handle(GetProductsListQuery request, CancellationToken cancellationToken)
        {
            // First, get the filtered products
            var productQuery = _context.Products.AsNoTracking()
                .Include(p => p.Images)
                .Include(p=>p.Tags)
                .Where(x =>
                    (request.ProductCategoryFilter == null || x.Category == request.ProductCategoryFilter)
                );

            if(request.NFCIds != null && request.NFCIds.Any())
            {
                productQuery = productQuery.Where(p => request.NFCIds.Contains(p.NFCId!));
            }

            if (request.KaratTypeFilter.Any())
            {
                productQuery = productQuery.Where(p => request.KaratTypeFilter.Contains(p.KaratType));
            }

            if(request.weightFromFilter != null && request.weightToFilter != null)
            {
                productQuery = productQuery.Where(p => p.Weight >= request.weightFromFilter && p.Weight <= request.weightToFilter);
            }

            if (!string.IsNullOrEmpty(request.SearchBy))
            {
                var keyword = request.SearchBy;
                KaratType karatType;
                decimal weight;

                if (Enum.TryParse(keyword.Replace(" ", ""), true, out karatType) && Enum.IsDefined(typeof(KaratType), karatType))
                {
                    productQuery = productQuery.Where(x => x.KaratType == karatType);
                }
                else if (decimal.TryParse(keyword, out weight))
                {
                    productQuery = productQuery.Where(x => x.Weight == weight);
                }
                else
                {
                    productQuery = productQuery.Where(x => x.Sku.Contains(request.SearchBy) || x.Name!.Contains(request.SearchBy));
                }
            }

            var totalRecords = await productQuery.CountAsync(cancellationToken);

            // Get paginated products
            var products = await productQuery
                .ApplySorting(request.SortBy!, request.SortDirection)
                .ApplyPagination(request.PageNumber, request.PageSize)
                .ToListAsync(cancellationToken);

            if (!products.Any())
            {
                return new PaginatedResponse<GetProductsVM>
                {
                    Data = new List<GetProductsVM>(),
                    TotalRecords = totalRecords,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize,
                    StatusCode = ResponseStatusCode.NoContent,
                };
            }

            

            var pricingSettings = await _context.PricingSettings.AsNoTracking()
                .ToDictionaryAsync(
                    ps => new { ps.KaratType, ps.ProductType },
                    ps => ps.Price,
                    cancellationToken
                );

            // Map to view models with price calculation
            var data = products.Select(product =>
            {
                var pricePerGram = pricingSettings.GetValueOrDefault(
                    new { KaratType = product.KaratType, ProductType = product.Type }, 0);

                return new GetProductsVM
                {
                    Id = product.Id,
                    Sku = product.Sku,
                    Name = product.Name,
                    Quantity = product.Quantity,
                    KaratType = product.KaratType,
                    Weight = product.Weight,
                    NFCId = product.NFCId,
                    Category = product.Category,
                    ProductType = product.Type,
                    Description = product.Description,
                    PricePerGram = pricePerGram,
                    Price = product.Weight * pricePerGram,
                    Images = product.Images.Select(i => new ProductImageVM
                    {
                        ImageUrl = i.ImageUrl,
                    }).ToList()
                };
            });

            // Apply price filtering
            if (request.PriceFromFilter.HasValue || request.PriceToFilter.HasValue)
            {
                data = data.Where(x =>
                    (!request.PriceFromFilter.HasValue || x.Price >= request.PriceFromFilter.Value) &&
                    (!request.PriceToFilter.HasValue || x.Price <= request.PriceToFilter.Value)
                );
            }

            return new PaginatedResponse<GetProductsVM>
            {
                Data = data.ToList(),
                TotalRecords = totalRecords,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                StatusCode = data.Any() ? ResponseStatusCode.Success : ResponseStatusCode.NoContent,
            };

        }
    }
}
