using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetDashboardInsights
{
    public class GetDashboardInsightsVM
    {
        public SalesTodayDto SalesToday { get; set; } = new();
        public decimal StockValue { get; set; }
        public CustomersDto Customers { get; set; } = new();
        public ItemsSoldDto ItemsSold { get; set; } = new();
        public List<StockWeightByKaratDto> StockWeightByKarat { get; set; } = new();
    }

    public record SalesTodayDto
    {
        public decimal Amount { get; set; }
        public decimal ChangePercentage { get; set; }
        public bool IsIncrease { get; set; }
    }

    public record StockValueDto
    {
        public decimal Amount { get; set; }
        public decimal ChangePercentage { get; set; }
        public bool IsIncrease { get; set; }
    }

    public record CustomersDto
    {
        public int Count { get; set; }
        public decimal ChangePercentage { get; set; }
        public bool IsIncrease { get; set; }
    }

    public record ItemsSoldDto
    {
        public int Count { get; set; }
        public decimal ChangePercentage { get; set; }
        public bool IsIncrease { get; set; }
    }

    public record StockWeightByKaratDto
    {
        public KaratType KaratType { get; set; }
        public decimal Weight { get; set; }
        public string DisplayName => $"{KaratType}K";
    }
}
