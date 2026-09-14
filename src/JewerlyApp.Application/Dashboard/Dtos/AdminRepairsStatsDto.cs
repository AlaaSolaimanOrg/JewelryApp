namespace JewerlyApp.Application.Dashboard.Dtos
{
    public class AdminRepairsStatsDto
    {
        public RepairsCollectedDto RepairsCollected { get; set; } = new();
        public RepairsCountsDto Repairs { get; set; } = new();
    }

    public class RepairsCollectedDto
    {
        public decimal Amount { get; set; }
        public int Payments { get; set; }
        public int RepairsTakenIn { get; set; }
    }

    public class RepairsCountsDto
    {
        public int InProgress { get; set; }
        public int AwaitingCall { get; set; }
        public int DueToday { get; set; }
        public int Overdue { get; set; }
        public decimal UnpaidBalance { get; set; }
        public int UnpaidCount { get; set; }
    }
}
