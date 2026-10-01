using JewerlyApp.Domain.Entities.Common;
using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Domain.Entities
{
    public class UsedGoldPurchase : Entity<Guid>
    {
        public string SerialNumber { get; set; } = default!;
        public Guid CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public UsedGoldPayMethod PayMethod { get; set; }
        public decimal TotalWeight { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Notes { get; set; }

        // Set only for a PayMethod.TradeIn purchase created alongside a sale.
        public Guid? SaleId { get; set; }
        public Sale? Sale { get; set; }

        public Customer Customer { get; set; } = default!;
        public List<UsedGoldPurchaseItem> Items { get; set; } = new();
    }
}
