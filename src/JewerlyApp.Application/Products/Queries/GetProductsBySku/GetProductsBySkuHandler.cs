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
    public class GetProductsBySkuHandler : IRequestHandler<GetProductsBySkuQuery, GenericResponse<List<GetProductsBySkuVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetProductsBySkuHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<GetProductsBySkuVM>>> Handle(GetProductsBySkuQuery request, CancellationToken cancellationToken)
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
                return new GenericResponse<List<GetProductsBySkuVM>>
                {
                    Data = new List<GetProductsBySkuVM>(),
                    StatusCode = ResponseStatusCode.NoContent,
                };
            }

            var data = products.Select(product =>
            {
                return new GetProductsBySkuVM
                {
                    Id = product.Id,
                    Sku = product.Sku,
                    Name = product.Name,
                    Images = product.Images.Select(i => new ProductImageVM
                    {
                        ImageUrl = i.ImageUrl,
                    }).ToList()
                };
            });


            return new GenericResponse<List<GetProductsBySkuVM>>
            {
                Data = data.ToList(),
                StatusCode = data.Any() ? ResponseStatusCode.Success : ResponseStatusCode.NoContent,
            };

        }
    }
}
