using JewerlyApp.Domain.Entities.Common;
using System;

namespace JewerlyApp.Domain.Entities
{
    public class UsedGoldPurchaseItem : Entity<Guid>
    {
        public Guid PurchaseId { get; set; }
        public int Karat { get; set; }
        public decimal Weight { get; set; }
        public decimal PricePerGram { get; set; }
        public decimal Subtotal { get; set; }

        public UsedGoldPurchase Purchase { get; set; } = default!;
    }
}
