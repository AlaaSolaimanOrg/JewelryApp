using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Products.Queries.GetProductSpecialPricing
{
    public class GetProductSpecialPricingHandler : IRequestHandler<GetProductSpecialPricingQuery, GenericResponse<decimal?>>
    {
        private readonly IApplicationDbContext _context;

        public GetProductSpecialPricingHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<decimal?>> Handle(GetProductSpecialPricingQuery request, CancellationToken cancellationToken)
        {
            var specialPrice = await _context.ProductSpecialPricings.AsNoTracking()
                .Where(x => x.ProductId == request.ProductId)
                .Select(x => (decimal?)x.SpecialPricePerGram)
                .FirstOrDefaultAsync(cancellationToken);

            return GenericResponse<decimal?>.Success(specialPrice);
        }
    }
}
