using JewerlyApp.Application.Products.Queries.GetProducts;

namespace JewerlyApp.Application.Products.Queries.GetBullionProducts
{
    public class BullionProductsVM
    {
        public List<GetProductsVM> Liras { get; set; } = new();
        public List<GetProductsVM> Ounces { get; set; } = new();
    }
}
