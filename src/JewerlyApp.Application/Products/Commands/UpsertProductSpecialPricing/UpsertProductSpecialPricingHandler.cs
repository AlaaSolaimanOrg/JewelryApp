using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Products.Commands.UpsertProductSpecialPricing
{
    public class UpsertProductSpecialPricingHandler : IRequestHandler<UpsertProductSpecialPricingCommand, GenericResponse<bool>>
    {
        private readonly IApplicationDbContext _context;

        public UpsertProductSpecialPricingHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<bool>> Handle(UpsertProductSpecialPricingCommand request, CancellationToken cancellationToken)
        {
            var existing = await _context.ProductSpecialPricings
                .FirstOrDefaultAsync(x => x.ProductId == request.ProductId, cancellationToken);

            if (existing != null)
            {
                existing.SpecialPricePerGram = request.SpecialPricePerGram;
            }
            else
            {
                var specialPricing = new ProductSpecialPricing
                {
                    Id = Guid.NewGuid(),
                    ProductId = request.ProductId,
                    SpecialPricePerGram = request.SpecialPricePerGram,
                };
                await _context.ProductSpecialPricings.AddAsync(specialPricing, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);
            return GenericResponse<bool>.Success(true);
        }
    }
}
