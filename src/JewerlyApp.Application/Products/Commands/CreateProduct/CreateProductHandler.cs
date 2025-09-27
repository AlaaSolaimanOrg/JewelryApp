using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
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
            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                KaratType = request.KaratType,
                Sku = request.Sku,
                Weight = request.Weight,
                Category = request.Category,
                Type = request.Type,
                Description = request.Description,
                Quantity = request.Quantity,
            };

            await _context.Products.AddAsync(product, cancellationToken);
            //await _context.SaveChangesAsync(cancellationToken);

            // Upload images if any
            if (request.Images != null && request.Images.Count > 0)
            {                

                await _fileService.UploadProductImagesAsync(product.Id, request.KaratType, request.Images);
            }

            return new GenericResponse<string>
            {
                Data = product.Sku,
                StatusCode = ResponseStatusCode.Created,
                Message = Messages.SuccessItemAdded
            };
        }
    }
}
