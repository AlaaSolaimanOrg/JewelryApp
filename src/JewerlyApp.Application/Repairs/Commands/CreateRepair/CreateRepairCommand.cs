using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Repairs.Dtos;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Repairs.Commands.CreateRepair
{
    public class CreateRepairCommand : IRequest<GenericResponse<Guid>>
    {
        public Guid CustomerId { get; set; }
        public string Notes { get; set; } = string.Empty;
        public List<CreateRepairItemDto> Items { get; set; } = new();
    }

    public class CreateRepairItemDto
    {
        public ProductCategory ItemType { get; set; }
        public ProductType Metal { get; set; }
        public decimal Weight { get; set; }
        public string StoneType { get; set; } = string.Empty;
        public RepairType RepairType { get; set; }
        public string Notes { get; set; } = string.Empty;
        public decimal DepositPaid { get; set; }
        public decimal Cost { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public decimal UrgentFee { get; set; }
        public decimal Discount { get; set; }
        public DateOnly? DueDate { get; set; }
    }
}
