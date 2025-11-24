namespace JewerlyApp.Application.Analytics.Queries.GetStaffPerformance
{
    public class StaffPerformanceVM
    {
        public string StaffName { get; set; } = string.Empty;
        public decimal SalesAmount { get; set; }
        public decimal Commission { get; set; }
    }
}
