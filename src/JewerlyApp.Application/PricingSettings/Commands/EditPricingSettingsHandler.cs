using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using JewerlyApp.Application.PricingSettings.Queries.GetPricingSettings;

namespace JewerlyApp.Application.Products.Commands.EditPricingSettings
{
    /// <summary>
    /// Handles the EditPricingSettingsCommand to either create or update a pricing setting.
    /// </summary>
    public class EditPricingSettingsHandler : IRequestHandler<EditPricingSettingsCommand, GenericResponse<bool>>
    {
        private readonly IApplicationDbContext _context;

        public EditPricingSettingsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<bool>> Handle(EditPricingSettingsCommand request, CancellationToken cancellationToken)
        {
            var settings = await _context.PricingSettings
                .Where(x => request.PricingSettings.Any(r => r.ProductType == x.ProductType && r.KaratType == x.KaratType))
                .ToListAsync(cancellationToken);

            foreach (var pricingSettingVm in request.PricingSettings)
            {
                var pricingSetting =settings
                    .FirstOrDefault(ps =>
                        ps.ProductType == pricingSettingVm.ProductType &&
                        ps.KaratType == pricingSettingVm.KaratType);

                if (pricingSetting == null)
                {
                    pricingSetting = new PricingSetting
                    {
                        ProductType = pricingSettingVm.ProductType,
                        KaratType = pricingSettingVm.KaratType,
                        Price = pricingSettingVm.PricePerGram
                    };
                    _context.PricingSettings.Add(pricingSetting);
                }
                else
                {
                    pricingSetting.Price = pricingSettingVm.PricePerGram;
                }
            }

            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<bool>
            {
                Data = true,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.SuccessItemUpdated
            };
        }
    }
}
