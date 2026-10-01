using JewerlyApp.Domain.Entities.Common;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Domain.Entities
{
    public class UsedGoldMeltBatch : Entity<Guid>
    {
        public string SerialNumber { get; set; } = default!;
        public decimal TotalWeight { get; set; }
        public decimal TotalCost { get; set; }
        public string? Notes { get; set; }

        public List<UsedGoldMeltBatchItem> Items { get; set; } = new();
    }
}
