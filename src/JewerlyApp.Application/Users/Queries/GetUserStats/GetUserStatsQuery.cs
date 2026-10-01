using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.Users.Queries.GetUserStats
{
    public class GetUserStatsQuery : IRequest<GenericResponse<UserStatsVM>>
    {
    }
}
