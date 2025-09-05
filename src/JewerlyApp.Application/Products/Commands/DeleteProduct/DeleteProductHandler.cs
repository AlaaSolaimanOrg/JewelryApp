using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Shared;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Products.Commands.DeleteProduct
{
    public class DeleteProductHandler : IRequestHandler<DeleteProductCommand, GenericResponse<string>>
    {
        private readonly IApplicationDbContext _context;

        public DeleteProductHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<string>> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

            if (product == null)
            {
                return new GenericResponse<string>
                {
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.errorNotFound
                };
            }

            _context.Products.Remove(product);

            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<string>
            {
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.successItemDeleted
            };
        }
    }
}
