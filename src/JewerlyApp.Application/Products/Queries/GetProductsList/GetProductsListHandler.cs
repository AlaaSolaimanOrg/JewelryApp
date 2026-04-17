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

            if(request.SKUs != null && request.SKUs.Any())
            {
                productQuery = productQuery.Where(p => request.SKUs.Contains(p.Sku!));
            }

            if (request.KaratTypeFilter.Any())
            {
                productQuery = productQuery.Where(p => request.KaratTypeFilter.Contains(p.KaratType));
            }

            if(request.weightFromFilter != null && request.weightToFilter != null)
            {
                productQuery = productQuery.Where(p => p.Weight >= request.weightFromFilter && p.Weight <= request.weightToFilter);
            }

            if (request.InStock.HasValue)
            {
                if (request.InStock.Value)
                    productQuery = productQuery.Where(p => p.Quantity > 0);
                else
                    productQuery = productQuery.Where(p => p.Quantity == 0);
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
                    productQuery = productQuery.Where(x =>
                               x.Sku.Contains(keyword) ||
                               (x.Name != null && x.Name.Contains(keyword)) ||
                               x.Tags.Any(t => t.Tag.Contains(keyword))
                           );
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

            var productIds = products.Select(p => p.Id).ToList();
            var specialPricings = await _context.ProductSpecialPricings.AsNoTracking()
                .Where(x => productIds.Contains(x.ProductId))
                .ToDictionaryAsync(x => x.ProductId, x => x.SpecialPricePerGram, cancellationToken);

            // Map to view models with price calculation
            var data = products.Select(product =>
            {
                var pricePerGram = specialPricings.TryGetValue(product.Id, out var sp)
                    ? sp
                    : pricingSettings.GetValueOrDefault(new { KaratType = product.KaratType, ProductType = product.Type }, 0);

                return new GetProductsVM
                {
                    Id = product.Id,
                    Sku = product.Sku,
                    Name = product.Name,
                    Quantity = product.Quantity,
                    KaratType = product.KaratType,
                    Weight = product.Weight,
                    Category = product.Category,
                    ProductType = product.Type,
                    Description = product.Description,
                    PricePerGram = pricePerGram,
                    Price = product.Weight * pricePerGram,
                    IsManualEntry = product.IsManualEntry,
                    Specification = product.Specification,
                    Tags = product.Tags.Select(productTag=>productTag.Tag).ToList(),
                    Images = product.Images.Select(i => new ProductImageVM
                    {
                        ImageUrl = i.ImageUrl,
                    }).ToList(),
                    DaysInInventory = product.CreatedDate.HasValue
                        ? (int)(DateTime.UtcNow - product.CreatedDate.Value).TotalDays
                        : null
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
