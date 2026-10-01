using JewerlyApp.Domain.Entities.Common;
using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Domain.Entities
{
    public class ReturnItem : Entity<Guid>
    {
        public Guid ReturnId { get; set; }
        public Guid SaleItemId { get; set; }
        public int QuantityPurchased { get; set; }
        public int QuantityReturned { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal ReturnAmount { get; set; }
        public ReturnReason Reason { get; set; }
        public string? ReasonNote { get; set; }
        public ItemCondition Condition { get; set; }
        public ReturnOption Option { get; set; } // Return to stock / Melt
        public bool IsTagPrinted { get; set; }
        public DateTime? TagPrintedDate { get; set; }
        public Return Return { get; set; } = default!;
        public SaleItem SaleItem { get; set; } = default!;

    }

}
