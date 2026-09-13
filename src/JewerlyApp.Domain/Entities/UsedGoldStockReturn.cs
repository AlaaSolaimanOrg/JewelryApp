using JewerlyApp.Domain.Entities.Common;
using System;

namespace JewerlyApp.Domain.Entities
{
    public class UsedGoldStockReturn : Entity<Guid>
    {
        public string SerialNumber { get; set; } = default!;
        public int Karat { get; set; }
        public decimal Weight { get; set; }
        public decimal Cost { get; set; }
        public string? Notes { get; set; }
    }
}
