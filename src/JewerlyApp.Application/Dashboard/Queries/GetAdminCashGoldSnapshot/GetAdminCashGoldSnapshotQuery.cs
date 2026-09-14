using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Dashboard.Dtos;
using MediatR;

namespace JewerlyApp.Application.Dashboard.Queries.GetAdminCashGoldSnapshot
{
    public class GetAdminCashGoldSnapshotQuery : IRequest<GenericResponse<AdminCashGoldSnapshotDto>>
    {
    }
}
