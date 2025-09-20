using System;

namespace JewerlyApp.Application.Carts.Queries.GetCartProducts
{
    public class GetCartProductsVM
    {
        public Guid ProductId { get; set; }
        public string Sku { get; set; }
        public string Name { get; set; }
        public int KaratType { get; set; }
        public decimal Weight { get; set; }
        public decimal PricePerGram { get; set; }
    }
}
