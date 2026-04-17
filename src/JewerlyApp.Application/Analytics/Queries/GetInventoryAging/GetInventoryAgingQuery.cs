using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.Analytics.Queries.GetInventoryAging
{
    public class GetInventoryAgingQuery : IRequest<GenericResponse<InventoryAgingVM>>
    {
    }
}
