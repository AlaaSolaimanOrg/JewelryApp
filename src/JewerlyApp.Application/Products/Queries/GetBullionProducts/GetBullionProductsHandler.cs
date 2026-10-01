using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Products.Queries.GetProducts;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Products.Queries.GetBullionProducts
{
    public class GetBullionProductsHandler : IRequestHandler<GetBullionProductsQuery, GenericResponse<BullionProductsVM>>
    {
        private const string LiraTag = "lira";
        private const string OunceTag = "ounce";

        private readonly IApplicationDbContext _context;

        public GetBullionProductsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<BullionProductsVM>> Handle(GetBullionProductsQuery request, CancellationToken cancellationToken)
        {
            var products = await _context.Products.AsNoTracking()
                .Include(p => p.Images)
                .Include(p => p.Tags)
                .Where(p => p.Quantity > 0 &&
                    p.Tags.Any(t => t.Tag.ToLower() == LiraTag || t.Tag.ToLower() == OunceTag))
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

            GetProductsVM Map(Product product)
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
                    Tags = product.Tags.Select(t => t.Tag).ToList(),
                    Images = product.Images.Select(i => new ProductImageVM { ImageUrl = i.ImageUrl }).ToList()
                };
            }

            bool HasTag(Product product, string tag) =>
                product.Tags.Any(t => string.Equals(t.Tag, tag, StringComparison.OrdinalIgnoreCase));

            var data = new BullionProductsVM
            {
                Liras = products.Where(p => HasTag(p, LiraTag)).Select(Map).ToList(),
                Ounces = products.Where(p => HasTag(p, OunceTag)).Select(Map).ToList()
            };

            return new GenericResponse<BullionProductsVM>
            {
                Data = data,
                StatusCode = ResponseStatusCode.Success,
            };
        }
    }
}
