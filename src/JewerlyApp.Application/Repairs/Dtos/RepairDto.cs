using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Repairs.Dtos
{
    public class RepairDto
    {
        public Guid Id { get; set; }
        public string RepairCode { get; set; } = string.Empty;
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public DateOnly OrderDate { get; set; }
        public RepairStatus Status { get; set; }
        public decimal TotalCost { get; set; }
        public string Notes { get; set; } = string.Empty;
        public List<RepairItemDto> Items { get; set; } = new();
    }

    public class RepairItemDto
    {
        public Guid Id { get; set; }
        public ProductCategory ItemType { get; set; }
        public ProductType Metal { get; set; }
        public decimal Weight { get; set; }
        public string StoneType { get; set; } = string.Empty;
        public RepairType RepairType { get; set; }
        public string Notes { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public decimal DepositPaid { get; set; }
        public decimal UrgentFee { get; set; }
        public decimal Discount { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public DateOnly? DueDate { get; set; }
        public decimal SubTotal { get; set; }
    }
}
