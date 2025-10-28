using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Products.Queries.GetProducts;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Products.Queries.GetQueryById
{
    public class GetProductByIdHandler : IRequestHandler<GetProductByIdQuery, GenericResponse<GetProductByIdVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetProductByIdHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<GetProductByIdVM>> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == request.Id || p.Sku == request.SearchBy, cancellationToken);

            if (product == null)
            {
                return new GenericResponse<GetProductByIdVM>
                {
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.ErrorNotFound
                };
            }
            var productVM = new GetProductByIdVM
            {
                Id = product.Id,
                Sku = product.Sku,
                NFCId = product.NFCId,
                Name = product.Name,
                Quantity = product.Quantity,
                KaratType = product.KaratType,
                Weight = product.Weight,
                Category = product.Category,
                ProductType = product.Type,
                Description = product.Description,
                Images = product.Images.Select(i => new ProductImageVM
                {
                    ImageUrl = i.ImageUrl
                }).ToList()
            };

            var pricePerGram = await _context.PricingSettings.AsNoTracking()
                .Where(priceSetting => priceSetting.KaratType == product.KaratType && priceSetting.ProductType == product.Type).Select(x => x.Price)
                .FirstOrDefaultAsync(cancellationToken);

            productVM.PricePerGram = pricePerGram;

            return new GenericResponse<GetProductByIdVM>
            {
                StatusCode = ResponseStatusCode.Success,
                Data = productVM
            };
        }
    }
}
