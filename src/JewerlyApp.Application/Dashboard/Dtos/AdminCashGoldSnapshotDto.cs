namespace JewerlyApp.Application.Dashboard.Dtos
{
    public class AdminCashGoldSnapshotDto
    {
        public StoreCashDto StoreCash { get; set; } = new();
        public TransfersBoxDto TransfersBox { get; set; } = new();
        public UsedGoldOnHandDto UsedGoldOnHand { get; set; } = new();
        public UsedGoldBoughtDto UsedGoldBought { get; set; } = new();
    }

    public class StoreCashDto
    {
        public decimal Amount { get; set; }
        public decimal CashIn { get; set; }
        public decimal CashOut { get; set; }
    }

    public class TransfersBoxDto
    {
        public decimal Amount { get; set; }
        public decimal TodayIn { get; set; }
    }

    public class UsedGoldOnHandDto
    {
        public decimal Weight { get; set; }
        public decimal AvgKarat { get; set; }
        public decimal InvestedValue { get; set; }
    }

    public class UsedGoldBoughtDto
    {
        public decimal Amount { get; set; }
        public decimal Weight { get; set; }
        public int Purchases { get; set; }
    }
}
