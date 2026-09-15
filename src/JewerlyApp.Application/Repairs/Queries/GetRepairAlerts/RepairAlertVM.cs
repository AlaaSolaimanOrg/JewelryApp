namespace JewerlyApp.Application.Repairs.Queries.GetRepairAlerts
{
    public class RepairAlertVM
    {
        public string RepairId { get; set; } = string.Empty;
        public string Customer { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public int Priority { get; set; }
    }
}
