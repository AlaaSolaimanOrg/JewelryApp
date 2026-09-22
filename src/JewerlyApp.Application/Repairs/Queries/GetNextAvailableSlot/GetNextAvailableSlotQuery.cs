using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.Repairs.Queries.GetNextAvailableSlot
{
    public class GetNextAvailableSlotQuery : IRequest<GenericResponse<int?>>
    {
    }
}
