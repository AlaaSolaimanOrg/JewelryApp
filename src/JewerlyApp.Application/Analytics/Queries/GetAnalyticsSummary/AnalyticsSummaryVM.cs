namespace JewerlyApp.Application.Analytics.Queries.GetAnalyticsSummary
{
    public class AnalyticsSummaryVM
    {
        public decimal AvgDailySales { get; set; }
        public string BestSellingCategory { get; set; } = string.Empty;
        public decimal BestSellingCategoryPercentage { get; set; }
        public string TopPerformer { get; set; } = string.Empty;
        public decimal TopPerformerSales { get; set; }
        public string MostValuableKarat { get; set; } = string.Empty;
        public decimal MostValuableKaratPercentage { get; set; }
    }
}
