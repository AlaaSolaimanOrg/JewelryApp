using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetSoldItems
{
    public class GetSoldItemsVM
    {
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitWeight { get; set; }
        public decimal WeightSummed { get; set; }
        public decimal PricePerGram { get; set; }
        public decimal Subtotal { get; set; }
        public DateTime LatestSaleDate { get; set; }
    }
}
