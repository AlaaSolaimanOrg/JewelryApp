using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.InventorySettings.Queries.GetLowStockThreshold
{
    public class GetLowStockThresholdQuery : IRequest<GenericResponse<int>>
    {
    }
}
