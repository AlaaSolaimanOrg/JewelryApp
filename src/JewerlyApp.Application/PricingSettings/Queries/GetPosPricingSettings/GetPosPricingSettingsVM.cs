using JewerlyApp.Domain.Enums;

namespace JewerlyApp.Application.PricingSettings.Queries.GetPosPricingSettings
{
    // Same as GetPricingSettingsVM but without StockWeight — POS-role users
    // can look up the price per gram but must not see stock-on-hand figures.
    public class GetPosPricingSettingsVM
    {
        public ProductType ProductType { get; set; }
        public KaratType KaratType { get; set; }
        public decimal PricePerGram { get; set; }
    }
}
