using JewerlyApp.Application.Common.Messages;
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

namespace JewerlyApp.Application.Products.Commands.CreateProduct
{
    public class CreateProductHandler : IRequestHandler<CreateProductCommand, GenericResponse<string>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IFileService _fileService;

        public CreateProductHandler(IApplicationDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        public async Task<GenericResponse<string>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {

            var skuExists = await _context.Products
      .AnyAsync(p => p.Sku == request.Sku, cancellationToken);

            if (skuExists)
            {
                return new GenericResponse<string>
                {
                    StatusCode = ResponseStatusCode.InternalServerError,
                    Message = $"Product with SKU '{request.Sku}' already exists."
                };
            }

            var productId = Guid.NewGuid();

            var product = new Product
            {
                Id = productId,
                Name = request.Name,
                KaratType = request.KaratType,
                Sku = request.Sku,
                Weight = request.Weight,
                Category = request.Category,
                Specification = request.Specification,
                Type = request.Type,
                Description = request.Description,
                Quantity = request.Quantity,
                Tags = request.Tags?
                    .Select(tag => new ProductTag
                    {
                        Id = Guid.NewGuid(),         
                        ProductId = productId,
                        Tag = tag.Trim()
                    })
                    .ToList() ?? new List<ProductTag>()
            };

            await _context.Products.AddAsync(product, cancellationToken);

            // update sku sequence
            var fullYear = DateTime.UtcNow.Year;

            var sequence = await _context.SkuSequences
                .FirstOrDefaultAsync(x => x.Category == request.Category && x.Year == fullYear);
            if (sequence != null)
            {
                sequence.LastNumber++;
            }



            if (request.Images != null && request.Images.Count > 0)
            {
                await _fileService.UploadProductImagesAsync(product.Id, request.KaratType, request.Images);
            }

            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<string>
            {
                Data = product.Sku,
                StatusCode = ResponseStatusCode.Created,
                Message = Messages.SuccessItemAdded
            };
        }

    }
}
