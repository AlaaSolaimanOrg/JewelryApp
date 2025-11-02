using JewerlyApp.Domain.Entities.Common;
using JewerlyApp.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace JewerlyApp.Domain.Entities
{
    public class Sale : Entity<Guid>
    {
        public Guid CustomerId { get; set; }
        public decimal? Discount { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public DiscountType DiscountType { get; set; }
        public string? Note { get; set; }
        public decimal? CashAmount { get; set; }
        public decimal? CardAmount { get; set; }
        public decimal SubTotal { get; set; }
        public decimal Total { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual ApplicationUser? CreatedByUser { get; set; }
        public Customer? Customer { get; set; }
        public List<SaleItem> SaleItems { get; set; } = new();
    }
}
