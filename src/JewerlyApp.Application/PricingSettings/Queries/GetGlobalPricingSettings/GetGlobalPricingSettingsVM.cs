using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace JewerlyApp.Application.PricingSettings.Queries.GetGlobalPricingSettings
{
    public class GetGlobalPricingSettingsVM
    {
        public string? ProductType { get; set; }

        [JsonPropertyName("price_gram_24k")]
        public decimal PriceGram24k { get; set; }

        [JsonPropertyName("price_gram_22k")]
        public decimal PriceGram22k { get; set; }

        [JsonPropertyName("price_gram_21k")]
        public decimal PriceGram21k { get; set; }

        [JsonPropertyName("price_gram_20k")]
        public decimal PriceGram20k { get; set; }

        [JsonPropertyName("price_gram_18k")]
        public decimal PriceGram18k { get; set; }

        [JsonPropertyName("price_gram_16k")]
        public decimal PriceGram16k { get; set; }

        [JsonPropertyName("price_gram_14k")]
        public decimal PriceGram14k { get; set; }

        [JsonPropertyName("price_gram_10k")]
        public decimal PriceGram10k { get; set; }
    }
}
