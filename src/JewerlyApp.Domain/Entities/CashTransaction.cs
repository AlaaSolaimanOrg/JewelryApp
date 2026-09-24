using JewerlyApp.Domain.Entities.Common;
using JewerlyApp.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace JewerlyApp.Domain.Entities
{
    public class CashTransaction : Entity<Guid>
    {
        public CashBoxType BoxType { get; set; }
        public CashTransactionType Type { get; set; }
        public decimal Amount { get; set; }
        public string? Category { get; set; }
        public string? CustomerName { get; set; }
        public string? Destination { get; set; }
        public string? Notes { get; set; }

        public Guid? SaleId { get; set; }
        public Sale? Sale { get; set; }

        public Guid? UsedGoldPurchaseId { get; set; }
        public UsedGoldPurchase? UsedGoldPurchase { get; set; }

        public Guid? RepairId { get; set; }
        public Repair? Repair { get; set; }

        // Shared by the two rows (out of one box, in to the other) created by a single "move money"
        // action — a plain correlation id, not a foreign key, so the two inserts never form a cycle.
        public Guid? TransferGroupId { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual ApplicationUser? CreatedByUser { get; set; }
    }
}
