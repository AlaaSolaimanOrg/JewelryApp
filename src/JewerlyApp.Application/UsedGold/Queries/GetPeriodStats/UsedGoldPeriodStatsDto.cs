namespace JewerlyApp.Application.UsedGold.Queries.GetPeriodStats
{
    public class UsedGoldPeriodStatsDto
    {
        public int PurchaseCount { get; set; }
        public decimal Spent { get; set; }
        public decimal SpentCash { get; set; }
        public decimal SpentCard { get; set; }
    }
}
