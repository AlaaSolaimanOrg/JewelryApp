using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Dashboard.Dtos;
using MediatR;

namespace JewerlyApp.Application.Dashboard.Queries.GetAdminRepairsStats
{
    public class GetAdminRepairsStatsQuery : IRequest<GenericResponse<AdminRepairsStatsDto>>
    {
    }
}
