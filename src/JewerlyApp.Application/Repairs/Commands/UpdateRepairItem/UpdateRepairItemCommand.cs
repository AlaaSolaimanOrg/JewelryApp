using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.ComponentModel.DataAnnotations;

namespace JewerlyApp.Application.Repairs.Commands.UpdateRepairItem
{
    public class UpdateRepairItemCommand : IRequest<GenericResponse<Unit>>
    {
        [Required]
        public Guid RepairItemId { get; set; }

        [Required]
        public decimal Cost { get; set; }
    }
}
