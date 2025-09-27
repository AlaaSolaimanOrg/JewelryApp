using JewerlyApp.Application.Products.Queries.GetProducts;
using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Products.Queries.GetQueryById
{
    public class GetProductByIdVM
    {
        public Guid Id { get; set; }
        public string Sku { get; set; }
        public string? Name { get; set; }
        public int? Quantity { get; set; }
        public KaratType KaratType { get; set; }
        public decimal Weight { get; set; }
        public ProductCategory Category { get; set; }
        public ProductType ProductType { get; set; }
        public string? Description { get; set; }
        public decimal? PricePerGram { get; set; } = null;
        public List<ProductImageVM> Images { get; set; } = new();
    }
}
