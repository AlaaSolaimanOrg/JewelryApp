using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Products.Queries.GetMeltedProducts
{
    public class MeltedProductVM
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string? Sku { get; set; }
        public string? ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal? Weight { get; set; }
        public int? KaratType { get; set; }
        public DateTime MeltedAt { get; set; }
    }
}
