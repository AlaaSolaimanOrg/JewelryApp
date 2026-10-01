using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetSalesInsights
{
    public class GetSalesInsightsVM
    {
        public decimal TotalSalesAmount { get; set; }
        public decimal CashAmountPaid { get; set; }
        public decimal CardAmountPaid { get; set; }
        public decimal DiscountAmount { get; set; }
        public int TransactionsCount { get; set; }
        public int ItemsSold { get; set; }
        public decimal AvgSale { get; set; }
        public decimal RefundAmount { get; set; }
        public List<GoldByKaratVM> GoldByKarat { get; set; } = new();
    }
}
