namespace JewerlyApp.Application.CashManagement.Dtos
{
    public class CashBalancesDto
    {
        public decimal StoreBalance { get; set; }
        public decimal TransferBalance { get; set; }
        public decimal StoreTodayIn { get; set; }
        public decimal StoreTodayOut { get; set; }
        public decimal TransferTodayIn { get; set; }
        public decimal TransferTodayOut { get; set; }
    }
}
