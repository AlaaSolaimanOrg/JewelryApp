using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Products.Queries.GetProducts;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Products.Queries.GetProductsBySku
{
    public class GetProductsBySkusHandler : IRequestHandler<GetProductsBySkusQuery, GenericResponse<List<GetProductsVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetProductsBySkusHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<GetProductsVM>>> Handle(GetProductsBySkusQuery request, CancellationToken cancellationToken)
        {
            var productQuery = _context.Products.AsNoTracking()
                .Include(p => p.Images)
                .Where(x =>
                    request.SKUs.Contains(x.Sku!)
                );


            var totalRecords = await productQuery.CountAsync(cancellationToken);

            var products = await productQuery
                .ToListAsync(cancellationToken);

            if (!products.Any())
            {
                return new GenericResponse<List<GetProductsVM>>
                {
                    Data = new List<GetProductsVM>(),
                    StatusCode = ResponseStatusCode.NoContent,
                };
            }
            var pricingSettings = await _context.PricingSettings.AsNoTracking()
              .ToDictionaryAsync(
                  ps => new { ps.KaratType, ps.ProductType },
                  ps => ps.Price,
                  cancellationToken
              );

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
                    Category = product.Category,
                    ProductType = product.Type,
                    Description = product.Description,
                    PricePerGram = pricePerGram,
                    Price = product.Weight * pricePerGram,
                    Images = product.Images.Select(i => new ProductImageVM
                    {
                        ImageUrl = i.ImageUrl,
                    })
                    .ToList()
                };
            });


            return new GenericResponse<List<GetProductsVM>>
            {
                Data = data.ToList(),
                StatusCode = data.Any() ? ResponseStatusCode.Success : ResponseStatusCode.NoContent,
            };

        }
    }
}
