namespace JewerlyApp.Application.UsedGold.Queries.GetPeriodStats
{
    public class UsedGoldPeriodStatsDto
    {
        public int PurchaseCount { get; set; }
        public decimal Spent { get; set; }
        public decimal SpentCash { get; set; }
        public decimal SpentCard { get; set; }
        public decimal BoughtWeight { get; set; }
        public decimal MeltedWeight { get; set; }
        public decimal ReturnedWeight { get; set; }
    }
}
