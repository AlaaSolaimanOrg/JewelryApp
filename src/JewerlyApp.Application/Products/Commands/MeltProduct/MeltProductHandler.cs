using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Products.Commands.MeltProduct
{
    public class MeltProductHandler : IRequestHandler<MeltProductCommand, GenericResponse<bool>>
    {
        private readonly IApplicationDbContext _context;

        public MeltProductHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<bool>> Handle(MeltProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);

            if (product == null)
            {
                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.ErrorNotFound
                };
            }

            var available = product.Quantity ?? 0;
            if (request.Quantity <= 0 || request.Quantity > available)
            {
                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = "Invalid quantity to melt."
                };
            }

            // Decrease product quantity
            product.Quantity = available - request.Quantity;

            // Create melt record
            var melt = new MeltRecord
            {
                Id = Guid.NewGuid(),
                ProductId = product.Id,
                Sku = product.Sku,
                ProductName = product.Name,
                Quantity = request.Quantity,
                Weight = product.Weight,
                KaratType = (int)product.KaratType,
                MeltedAt = DateTime.UtcNow
            };

            await _context.MeltRecords.AddAsync(melt, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<bool>
            {
                StatusCode = ResponseStatusCode.Success,
                Data = true,
                Message = Messages.SuccessItemsMelted
            };
        }
    }
}
