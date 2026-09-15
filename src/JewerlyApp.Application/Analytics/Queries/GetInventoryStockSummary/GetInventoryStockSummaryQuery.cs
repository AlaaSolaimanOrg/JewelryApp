using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.Analytics.Queries.GetInventoryStockSummary
{
    public class GetInventoryStockSummaryQuery : IRequest<GenericResponse<InventoryStockSummaryVM>>
    {
    }
}
