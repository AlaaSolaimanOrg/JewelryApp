namespace JewerlyApp.Application.Dashboard.Dtos
{
    public class PosDashboardStatsDto
    {
        public decimal StoreCashBalance { get; set; }
        public decimal StoreCashTodayDelta { get; set; }
        public decimal UsedGoldWeight { get; set; }
        public decimal UsedGoldAverageKarat { get; set; }
        public decimal UsedGoldValue { get; set; }
    }
}
