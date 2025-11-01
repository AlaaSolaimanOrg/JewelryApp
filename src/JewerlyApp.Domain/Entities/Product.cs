using JewerlyApp.Domain.Entities.Common;
using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Domain.Entities
{
    public class Product : Entity<Guid>
    {
        public string? Sku { get; set; }
        public string? NFCId { get; set; }
        public string? Name { get; set; }
        public KaratType KaratType { get; set; }
        public decimal Weight { get; set; }
        public ProductType Type { get; set; }
        public ProductCategory? Category { get; set; }
        public string? Description { get; set; }
        public int? Quantity { get; set; } = 1;
        public bool IsManualEntry { get; set; }
        public List<ProductImage> Images { get; set; } = new();
        public string? TagsSerialized { get; set; }

        [NotMapped]
        public List<string> Tags
        {
            get => string.IsNullOrEmpty(TagsSerialized)
                ? new List<string>()
                : TagsSerialized.Split(',').Select(t => t.Trim()).ToList();

            set => TagsSerialized = value != null
                ? string.Join(",", value)
                : null;
        }
    }
}
