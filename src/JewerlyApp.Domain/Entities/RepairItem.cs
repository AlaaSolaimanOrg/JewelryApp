using JewerlyApp.Domain.Entities.Common;
using JewerlyApp.Domain.Enums;
using System;

namespace JewerlyApp.Domain.Entities
{
    public class RepairItem : Entity<Guid>
    {
        public Guid RepairId { get; set; }
        public Repair Repair { get; set; } = null!;
        public ProductCategory ItemType { get; set; }
        public ProductType Metal { get; set; } 
        public decimal Weight { get; set; }
        public string StoneType { get; set; } = string.Empty;
        public RepairType RepairType { get; set; }
        public string Notes { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public decimal DepositPaid { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public DateOnly? DueDate { get; set; }
    }
}
