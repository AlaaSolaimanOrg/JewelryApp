using JewerlyApp.Domain.Entities.Common;
using JewerlyApp.Domain.Enums;

namespace JewerlyApp.Domain.Entities
{
    public class PricingSetting : Entity<Guid>
    {
        public ProductType ProductType { get; set; }
        public KaratType KaratType { get; set; }
        public decimal Price { get; set; }
    }
}
