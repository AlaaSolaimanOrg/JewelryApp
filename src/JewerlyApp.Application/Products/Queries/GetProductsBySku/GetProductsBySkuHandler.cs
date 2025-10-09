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
    public class GetProductsBySkuHandler : IRequestHandler<GetProductsBySkuQuery, GenericResponse<List<GetProductsVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetProductsBySkuHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<GetProductsVM>>> Handle(GetProductsBySkuQuery request, CancellationToken cancellationToken)
        {
            var productQuery = _context.Products.AsNoTracking()
                .Include(p => p.Images)
                .Where(x =>
                    request.skus.Contains(x.Sku)
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

            var data = products.Select(product =>
            {
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
                    //PricePerGram = pricePerGram,
                    //Price = product.Weight * pricePerGram,
                    Images = product.Images.Select(i => new ProductImageVM
                    {
                        ImageUrl = i.ImageUrl,
                    }).ToList()
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
