using System;

namespace JewerlyApp.Application.Customers.Queries.GetTopCustomersReport
{
    public class CustomerReportRowVM
    {
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public int Purchases { get; set; }
        public int Items { get; set; }
        public decimal Spent { get; set; }
        public decimal AvgDiscount { get; set; }
        public DateTime? Since { get; set; }
        public DateTime? LastPurchase { get; set; }
    }
}
