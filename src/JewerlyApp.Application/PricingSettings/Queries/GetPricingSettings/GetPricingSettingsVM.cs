using JewerlyApp.Domain.Enums;

namespace JewerlyApp.Application.PricingSettings.Queries.GetPricingSettings
{
    public class GetPricingSettingsVM
    {
        public ProductType ProductType { get; set; }
        public KaratType KaratType { get; set; }
        public decimal PricePerGram { get; set; }
    }
}
