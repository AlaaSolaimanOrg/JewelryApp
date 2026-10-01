namespace JewerlyApp.Application.Repairs.Queries.GetRepairsStats
{
    public class RepairsStatsVM
    {
        public int RepairCount { get; set; }
        public decimal TotalRevenue { get; set; }
        public int PaidCount { get; set; }
        public decimal TotalAll { get; set; }
        public decimal UnpaidTotal { get; set; }
        public int UnpaidCount { get; set; }
        public decimal AvgVal { get; set; }
        public double AvgTurn { get; set; }
    }
}
