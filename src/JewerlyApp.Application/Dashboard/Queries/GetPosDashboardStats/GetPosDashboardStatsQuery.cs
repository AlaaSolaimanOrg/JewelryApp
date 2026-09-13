using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Dashboard.Dtos;
using MediatR;

namespace JewerlyApp.Application.Dashboard.Queries.GetPosDashboardStats
{
    public class GetPosDashboardStatsQuery : IRequest<GenericResponse<PosDashboardStatsDto>>
    {
    }
}
