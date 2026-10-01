namespace JewerlyApp.Application.Repairs.Queries.GetAvgRepairValueHistory
{
    public class AvgValueHistoryVM
    {
        public string Label { get; set; } = string.Empty;
        public decimal Avg { get; set; }
        public int Count { get; set; }
        public decimal Total { get; set; }
    }
}
