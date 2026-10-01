using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Analytics.Queries.GetInventoryMovement
{
    public class GetInventoryMovementQuery : IRequest<GenericResponse<InventoryMovementVM>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
