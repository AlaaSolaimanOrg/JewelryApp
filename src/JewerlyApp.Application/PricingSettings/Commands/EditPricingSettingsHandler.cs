using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Products.Commands.EditPricingSettings
{
    public class EditPricingSettingsHandler
        : IRequestHandler<EditPricingSettingsCommand, GenericResponse<bool>>
    {
        private readonly IApplicationDbContext _context;

        public EditPricingSettingsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<bool>> Handle(
            EditPricingSettingsCommand request,
            CancellationToken cancellationToken)
        {
            var productTypes = request.PricingSettings
                .Select(x => x.ProductType)
                .Distinct()
                .ToList();

            var existingSettings = await _context.PricingSettings
                .Where(x => productTypes.Contains(x.ProductType))
                .ToListAsync(cancellationToken);

            foreach (var vm in request.PricingSettings)
            {
                var existing = existingSettings.FirstOrDefault(x =>
                    x.ProductType == vm.ProductType &&
                    x.KaratType == vm.KaratType);

                if (existing == null)
                {
                    // Create new pricing setting
                    var newSetting = new PricingSetting
                    {
                        ProductType = vm.ProductType,
                        KaratType = vm.KaratType,
                        Price = vm.PricePerGram
                    };

                    _context.PricingSettings.Add(newSetting);

                    // Log creation
                    _context.PricingSettingLogs.Add(new PricingSettingLog
                    {
                        ProductType = vm.ProductType,
                        KaratType = vm.KaratType,
                        OldPrice = 0,
                        NewPrice = vm.PricePerGram,
                    
                    });
                }
                else
                {
                    // Log update ONLY if price changed
                    _context.PricingSettingLogs.Add(new PricingSettingLog
                    {
                        ProductType = existing.ProductType,
                        KaratType = existing.KaratType,
                        OldPrice = existing.Price,
                        NewPrice = vm.PricePerGram
                    });

                    existing.Price = vm.PricePerGram;
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
