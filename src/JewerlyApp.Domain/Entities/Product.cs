using JewerlyApp.Domain.Entities.Common;
using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Domain.Entities
{
    public class Product : Entity<Guid>
    {
        public string? Sku { get; set; }
        public string? Name { get; set; }
        public KaratType KaratType { get; set; }
        public decimal Weight { get; set; }
        public ProductType Type { get; set; }
        public ProductCategory? Category { get; set; }
        public string? Description { get; set; }
        public int? Quantity { get; set; } = 1;
        public bool IsManualEntry { get; set; }
        public List<ProductImage> Images { get; set; } = new();
    }
}
