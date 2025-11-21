using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;

namespace JewerlyApp.Application.Repairs.Commands.UpdateRepairStatus
{
    public class UpdateRepairStatusCommand : IRequest<GenericResponse<Unit>>
    {
        public Guid Id { get; set; }
        public RepairStatus Status { get; set; }
    }
}
