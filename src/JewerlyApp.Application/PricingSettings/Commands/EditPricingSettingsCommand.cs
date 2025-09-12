using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.PricingSettings.Queries.GetPricingSettings;
using MediatR;
using System.Collections.Generic;

namespace JewerlyApp.Application.Products.Commands.EditPricingSettings
{
    public class EditPricingSettingsCommand : IRequest<GenericResponse<bool>>
    {
        public List<GetPricingSettingsVM> PricingSettings { get; set; } = new List<GetPricingSettingsVM>();
    }
}
