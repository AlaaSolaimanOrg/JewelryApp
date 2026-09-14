using System.Collections.Generic;

namespace JewerlyApp.Application.Dashboard.Dtos
{
    public class AdminSalesSummaryDto
    {
        public SalesRevenueDto SalesRevenue { get; set; } = new();
        public List<TrendPointDto> SalesTrend { get; set; } = new();
        public SalesPaymentsDto Payments { get; set; } = new();
        public List<GoldByKaratDto> GoldSoldToday { get; set; } = new();
        public TopCategoryDto TopCategory { get; set; } = new();
    }

    public class SalesRevenueDto
    {
        public decimal Amount { get; set; }
        public int Transactions { get; set; }
        public decimal ChangePercentage { get; set; }
        public bool IsIncrease { get; set; }
    }

    public class TrendPointDto
    {
        public string Label { get; set; } = string.Empty;
        public decimal Value { get; set; }
    }

    public class SalesPaymentsDto
    {
        public decimal Total { get; set; }
        public PaymentSplitDto Cash { get; set; } = new();
        public PaymentSplitDto Card { get; set; } = new();
        public int ItemsSold { get; set; }
        public decimal ItemsSoldWeight { get; set; }
        public decimal Discounts { get; set; }
        public int DiscountedSalesCount { get; set; }
        public decimal AvgSale { get; set; }
        public int Customers { get; set; }
        public int CustomersAddedToday { get; set; }
    }

    public class PaymentSplitDto
    {
        public decimal Amount { get; set; }
        public decimal Percentage { get; set; }
    }

    public class GoldByKaratDto
    {
        public int Karat { get; set; }
        public decimal Weight { get; set; }
        public decimal Percentage { get; set; }
    }

    public class TopCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public int ItemsSold { get; set; }
    }
}
