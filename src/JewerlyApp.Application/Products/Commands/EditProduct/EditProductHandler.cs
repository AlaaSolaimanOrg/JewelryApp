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

namespace JewerlyApp.Application.Products.Commands.EditProduct
{
    public class EditProductHandler : IRequestHandler<EditProductCommand, GenericResponse<bool>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IFileService _fileService;

        public EditProductHandler(IApplicationDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        public async Task<GenericResponse<bool>> Handle(EditProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

            if (product == null)
            {
                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.ErrorNotFound
                };
            }

            product.Sku = request.Sku;
            product.NFCId = request.NFCId;
            product.Name = request.Name;
            product.KaratType = request.KaratType;
            product.Weight = request.Weight;
            product.Category = request.Category;
            product.Type = request.Type;
            product.Description = request.Description;
            product.LastUpdatedDate = DateTime.UtcNow;
            product.Quantity = request.Quantity;
            
            if (product.Images != null && product.Images.Any())
            {
                _context.ProductImages.RemoveRange(product.Images);
            }
            product.Images.Clear();

            if (request.Images != null && request.Images.Any())
            {
                await _fileService.UploadProductImagesAsync(product.Id, product.KaratType, request.Images);
            }

            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<bool>
            {
                StatusCode = ResponseStatusCode.Success,
                Data = true,
                Message = Messages.SuccessItemUpdated
            };
        }
    }
}
