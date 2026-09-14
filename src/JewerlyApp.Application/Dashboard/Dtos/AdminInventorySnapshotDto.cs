namespace JewerlyApp.Application.Dashboard.Dtos
{
    public class AdminInventorySnapshotDto
    {
        public StockValueDto StockValue { get; set; } = new();
        public RefundsPaidOutDto RefundsPaidOut { get; set; } = new();
    }

    public class StockValueDto
    {
        public decimal Amount { get; set; }
        public int Items { get; set; }
        public decimal Weight { get; set; }
    }

    public class RefundsPaidOutDto
    {
        public decimal Amount { get; set; }
        public int Returns { get; set; }
        public int ToStock { get; set; }
        public int ToMelt { get; set; }
    }
}
