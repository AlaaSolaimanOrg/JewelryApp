using JewerlyApp.Domain.Entities.Common;
using System;

namespace JewerlyApp.Domain.Entities
{
    public class MeltRecord : Entity<Guid>
    {
        public Guid ProductId { get; set; }
        public string? Sku { get; set; }
        public string? ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal? Weight { get; set; }
        public int? KaratType { get; set; }
        public DateTime MeltedAt { get; set; } = DateTime.UtcNow;
    }
}
