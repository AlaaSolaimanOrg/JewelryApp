using JewerlyApp.Application.Common.Responses;
using MediatR;
using System.Collections.Generic;

namespace JewerlyApp.Application.PricingSettings.Queries.GetPricingSettings
{
    public class GetPricingSettingsQuery : IRequest<GenericResponse<List<GetPricingSettingsVM>>>
    {
    }
}
