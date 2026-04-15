using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;

namespace JewerlyApp.Application.Repairs.Commands.UpdateRepair
{
    public class UpdateRepairCommand : IRequest<GenericResponse<Unit>>
    {
        public Guid Id { get; set; }
        public decimal Cost { get; set; }

    }
}
