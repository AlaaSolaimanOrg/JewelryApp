using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetSaleById
{
    public class SaleItemVM
    {
        public string ProductName { get; set; } = string.Empty;
        public KaratType Karat { get; set; }
        public decimal Weight { get; set; }
        public decimal? PricePerGram { get; set; }
        public decimal Subtotal { get; set; }
        public int Quantity { get; set; }
    }
}
