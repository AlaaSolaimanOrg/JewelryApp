using JewerlyApp.Domain.Entities.Common;

namespace JewerlyApp.Domain.Entities
{
    public class ProductSpecialPricing : Entity<Guid>
    {
        public Guid ProductId { get; set; }
        public decimal SpecialPricePerGram { get; set; }
        public virtual Product? Product { get; set; }
    }
}
