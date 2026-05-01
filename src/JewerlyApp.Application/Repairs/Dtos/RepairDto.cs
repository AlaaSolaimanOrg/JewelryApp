using JewerlyApp.Domain.Enums;
using System;

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
        public string Notes { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public DateOnly? DueDate { get; set; }
        public int? SlotNumber { get; set; }
        public string? ReceiverName { get; set; }
        public DateOnly? PickedUpDate { get; set; }
    }
}
