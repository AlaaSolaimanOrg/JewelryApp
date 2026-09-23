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
        public PaymentStatus PaymentStatus { get; set; }
        public DateOnly? DueDate { get; set; }
        public int? SlotNumber { get; set; }
        public string? ReceiverName { get; set; }
        public DateOnly? PickedUpDate { get; set; }
        public DateOnly? PaidDate { get; set; }
        public bool Notified { get; set; }
        public DateOnly? NotifiedDate { get; set; }
        public DateOnly? CancelledDate { get; set; }
        public string? PayMethod { get; set; }
    }
}
