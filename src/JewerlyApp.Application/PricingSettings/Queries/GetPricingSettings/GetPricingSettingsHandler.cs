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

            var stockByKaratAndType = await _context.Products
                .AsNoTracking()
                .Where(p => p.Weight > 0 && p.Quantity > 0)
                .GroupBy(p => new { p.Type, p.KaratType })
                .Select(g => new
                {
                    g.Key.Type,
                    g.Key.KaratType,
                    TotalWeight = g.Sum(p => p.Weight * (p.Quantity ?? 0))
                })
                .ToListAsync(cancellationToken);

            foreach (var setting in pricingSettings)
            {
                var stock = stockByKaratAndType.FirstOrDefault(x =>
                    x.Type == setting.ProductType && x.KaratType == setting.KaratType);
                setting.StockWeight = stock?.TotalWeight ?? 0;
            }

            return new GenericResponse<List<GetPricingSettingsVM>>
            {
                Data = pricingSettings,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.SuccessItemUpdated
            };
        }
    }
}
