using JewerlyApp.Domain.Entities.Common;
using JewerlyApp.Domain.Enums;
using System;

namespace JewerlyApp.Domain.Entities
{
    public class Repair : Entity<Guid>
    {
        public string RepairCode { get; set; } = string.Empty;
        public Guid CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
        public DateOnly OrderDate { get; set; }
        public RepairStatus Status { get; set; }
        public string Notes { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public decimal DepositPaid { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public DateOnly? DueDate { get; set; }
    }
}
