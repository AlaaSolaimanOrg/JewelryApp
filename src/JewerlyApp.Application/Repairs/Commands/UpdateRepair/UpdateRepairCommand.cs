using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Repairs.Dtos;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Repairs.Commands.UpdateRepair
{
    public class UpdateRepairCommand : IRequest<GenericResponse<Unit>>
    {
        public Guid Id { get; set; }
        public string Notes { get; set; } = string.Empty;
        public List<UpdateRepairItemDto> Items { get; set; } = new();
    }

    public class UpdateRepairItemDto
    {
        public Guid? Id { get; set; } // Nullable for new items
        public ProductCategory ItemType { get; set; }
        public ProductType Metal { get; set; }
        public decimal Weight { get; set; }
        public string StoneType { get; set; } = string.Empty;
        public RepairType RepairType { get; set; }
        public string Notes { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public DateOnly? DueDate { get; set; }
    }
}
