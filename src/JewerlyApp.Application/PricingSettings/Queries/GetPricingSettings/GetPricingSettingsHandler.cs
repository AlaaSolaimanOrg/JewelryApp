using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.PricingSettings.Queries.GetPricingSettings
{
    
    public class GetPricingSettingsHandler : IRequestHandler<GetPricingSettingsQuery, GenericResponse<List<GetPricingSettingsVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetPricingSettingsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<GetPricingSettingsVM>>> Handle(GetPricingSettingsQuery request, CancellationToken cancellationToken)
        {
            var pricingSettings = await _context.PricingSettings
                .Select(ps => new GetPricingSettingsVM
                {
                    ProductType = ps.ProductType,
                    KaratType = ps.KaratType,
                    PricePerGram = ps.Price
                })
                .ToListAsync(cancellationToken);

            return new GenericResponse<List<GetPricingSettingsVM>>
            {
                Data = pricingSettings,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.SuccessItemUpdated
            };
        }
    }
}
