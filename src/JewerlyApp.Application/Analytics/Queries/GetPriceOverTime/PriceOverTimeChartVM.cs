using System;
using JewerlyApp.Domain.Enums;

namespace JewerlyApp.Application.Analytics.Queries.GetGoldPriceOverTime
{
    public class PriceOverTimeChartVM
    {
        public string DateLabel { get; set; } = string.Empty;
        public decimal Karat18 { get; set; }
        public decimal Karat21 { get; set; }
        public decimal Karat22 { get; set; }
        public decimal Karat24 { get; set; }
    }
}
