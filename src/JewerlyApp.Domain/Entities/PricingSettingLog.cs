using JewerlyApp.Domain.Entities.Common;
using JewerlyApp.Domain.Enums;

namespace JewerlyApp.Domain.Entities
{
    public class PricingSettingLog : Entity<Guid>
    {
        public int ProductLogId { get; set; }

        public ProductType ProductType { get; set; }
        public KaratType KaratType { get; set; }

        public decimal OldPrice { get; set; }
        public decimal NewPrice { get; set; }
    }
}
