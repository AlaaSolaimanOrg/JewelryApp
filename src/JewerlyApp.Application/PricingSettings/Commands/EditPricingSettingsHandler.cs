using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

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
            var pricingSetting = await _context.PricingSettings
                .FirstOrDefaultAsync(ps =>
                    ps.ProductType == request.ProductType &&
                    ps.KaratType == request.KaratType,
                    cancellationToken);

            if (pricingSetting == null)
            {
                pricingSetting = new PricingSetting
                {
                    ProductType = request.ProductType,
                    KaratType = request.KaratType,
                    Price = request.PricePerGram
                };
                _context.PricingSettings.Add(pricingSetting);
            }
            else
            {
                pricingSetting.Price = request.PricePerGram;
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
