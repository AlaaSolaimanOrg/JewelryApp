using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Dashboard.Dtos;
using MediatR;

namespace JewerlyApp.Application.Dashboard.Queries.GetAdminInventorySnapshot
{
    public class GetAdminInventorySnapshotQuery : IRequest<GenericResponse<AdminInventorySnapshotDto>>
    {
    }
}
