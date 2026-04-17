using JewerlyApp.Domain.Enums;
using System.Collections.Generic;

namespace JewerlyApp.Application.Analytics.Queries.GetInventoryAging
{
    public class InventoryAgingVM
    {
        public double AverageDaysInInventory { get; set; }
        public double AverageTurnoverDays { get; set; }
        public List<AgingBucketVM> AgingBuckets { get; set; } = new();
        public List<AgingItemVM> OldestItems { get; set; } = new();
    }

    public class AgingBucketVM
    {
        public string Label { get; set; } = string.Empty;
        public int ItemCount { get; set; }
        public decimal TotalEstimatedValue { get; set; }
        public decimal Percentage { get; set; }
    }

    public class AgingItemVM
    {
        public string Sku { get; set; } = string.Empty;
        public string? Name { get; set; }
        public ProductCategory? Category { get; set; }
        public KaratType KaratType { get; set; }
        public int DaysInInventory { get; set; }
        public decimal EstimatedValue { get; set; }
        public int Quantity { get; set; }
    }
}
