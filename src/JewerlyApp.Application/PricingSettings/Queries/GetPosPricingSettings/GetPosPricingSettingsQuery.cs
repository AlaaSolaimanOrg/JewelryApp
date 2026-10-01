using JewerlyApp.Application.Common.Responses;
using MediatR;
using System.Collections.Generic;

namespace JewerlyApp.Application.PricingSettings.Queries.GetPosPricingSettings
{
    public class GetPosPricingSettingsQuery : IRequest<GenericResponse<List<GetPosPricingSettingsVM>>>
    {
    }
}
