using JewerlyApp.Domain.Entities.Common;
using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Domain.Entities
{
    public class Repair : Entity<Guid>
    {
        public string RepairCode { get; set; } = string.Empty;
        public Guid CustomerId { get; set; }
        public Customer Customer { get; set; } = null!;
        public DateOnly OrderDate { get; set; }
        public RepairStatus Status { get; set; }
        public decimal TotalCost { get; set; }
        public ICollection<RepairItem> Items { get; set; } = new List<RepairItem>();
    }
}
