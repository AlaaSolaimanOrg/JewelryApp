using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetSalesInsights
{
    public class GoldByKaratVM
    {
        public KaratType KaratType { get; set; }
        public decimal Weight { get; set; }
        public decimal PricePerGram { get; set; }
        public decimal TotalValue { get; set; }
    }
}
