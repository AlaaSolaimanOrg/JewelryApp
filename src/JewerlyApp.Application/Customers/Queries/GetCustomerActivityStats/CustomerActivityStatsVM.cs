namespace JewerlyApp.Application.Customers.Queries.GetCustomerActivityStats
{
    public class CustomerActivityStatsVM
    {
        public int Active { get; set; }
        public int NewCustomers { get; set; }
        public decimal Revenue { get; set; }
        public decimal NewRevenue { get; set; }
        public decimal ReturningRevenue { get; set; }
        public decimal AvgDiscount { get; set; }
    }
}
