namespace JewerlyApp.Application.Repairs.Queries.GetRepairHealthMetrics
{
    public class RepairHealthMetricsVM
    {
        public int OnTimeRate { get; set; }
        public int OnTimeCount { get; set; }
        public int CollectRate { get; set; }
        public int CancelRate { get; set; }
        public int CancelCount { get; set; }
        public int CompletedCount { get; set; }
        public int TotalCount { get; set; }
    }
}
