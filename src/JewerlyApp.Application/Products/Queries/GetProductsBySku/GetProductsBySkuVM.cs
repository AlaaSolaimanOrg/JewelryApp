using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Products.Queries.GetProducts
{
    public class GetProductsBySkuVM
    {
        public Guid Id { get; set; }
        public string Sku { get; set; }
        public string? Name { get; set; }
        public List<ProductImageVM> Images { get; set; } = new();

    }
}
