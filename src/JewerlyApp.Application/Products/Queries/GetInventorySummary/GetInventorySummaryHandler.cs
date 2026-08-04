using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Products.Queries.GetInventorySummary
{
    public class GetInventorySummaryHandler : IRequestHandler<GetInventorySummaryQuery, GenericResponse<InventorySummaryVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetInventorySummaryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<InventorySummaryVM>> Handle(GetInventorySummaryQuery request, CancellationToken cancellationToken)
        {
            var productQuery = _context.Products.AsNoTracking()
                .Where(x =>
                    (request.ProductCategoryFilter == null || x.Category == request.ProductCategoryFilter)
                );

            if (request.SKUs != null && request.SKUs.Any())
            {
                productQuery = productQuery.Where(p => request.SKUs.Contains(p.Sku!));
            }

            if (request.KaratTypeFilter.Any())
            {
                productQuery = productQuery.Where(p => request.KaratTypeFilter.Contains(p.KaratType));
            }

            if (request.weightFromFilter != null && request.weightToFilter != null)
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

                if (Enum.TryParse(keyword.Replace(" ", ""), true, out KaratType karatType) && Enum.IsDefined(typeof(KaratType), karatType))
                {
                    productQuery = productQuery.Where(x => x.KaratType == karatType);
                }
                else if (decimal.TryParse(keyword, out decimal weight))
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

            var products = await productQuery
                .Select(p => new
                {
                    p.Id,
                    p.Weight,
                    p.Quantity,
                    p.KaratType,
                    p.Type
                })
                .ToListAsync(cancellationToken);

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

            var priced = products.Select(product =>
            {
                var pricePerGram = specialPricings.TryGetValue(product.Id, out var sp)
                    ? sp
                    : pricingSettings.GetValueOrDefault(new { KaratType = product.KaratType, ProductType = product.Type }, 0);

                return new
                {
                    product.Quantity,
                    product.Weight,
                    Price = product.Weight * pricePerGram
                };
            });

            if (request.PriceFromFilter.HasValue || request.PriceToFilter.HasValue)
            {
                priced = priced.Where(x =>
                    (!request.PriceFromFilter.HasValue || x.Price >= request.PriceFromFilter.Value) &&
                    (!request.PriceToFilter.HasValue || x.Price <= request.PriceToFilter.Value)
                );
            }

            var list = priced.ToList();

            var summary = new InventorySummaryVM
            {
                TotalProducts = list.Count,
                TotalQuantity = list.Sum(x => x.Quantity ?? 0),
                TotalWeight = list.Sum(x => x.Weight * (x.Quantity ?? 0)),
                TotalValue = list.Sum(x => x.Price * (x.Quantity ?? 0))
            };

            return new GenericResponse<InventorySummaryVM>
            {
                Data = summary,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
