using JewerlyApp.Domain.Entities.Common;
using System;

namespace JewerlyApp.Domain.Entities
{
    public class InventorySetting : Entity<Guid>
    {
        public int LowStockThreshold { get; set; }
    }
}
