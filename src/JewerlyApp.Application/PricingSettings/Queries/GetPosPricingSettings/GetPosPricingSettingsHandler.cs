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

namespace JewerlyApp.Application.PricingSettings.Queries.GetPosPricingSettings
{
    public class GetPosPricingSettingsHandler : IRequestHandler<GetPosPricingSettingsQuery, GenericResponse<List<GetPosPricingSettingsVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetPosPricingSettingsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<GetPosPricingSettingsVM>>> Handle(GetPosPricingSettingsQuery request, CancellationToken cancellationToken)
        {
            var pricingSettings = await _context.PricingSettings
                .Select(ps => new GetPosPricingSettingsVM
                {
                    ProductType = ps.ProductType,
                    KaratType = ps.KaratType,
                    PricePerGram = ps.Price
                })
                .ToListAsync(cancellationToken);

            return new GenericResponse<List<GetPosPricingSettingsVM>>
            {
                Data = pricingSettings,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
