namespace JewerlyApp.Application.Customers.Queries.GetCustomerBaseStats
{
    public class CustomerBaseStatsVM
    {
        public int TotalCustomers { get; set; }
        public int NewThisYear { get; set; }
        public int RepeatRate { get; set; }
        public int RepeatCount { get; set; }
        public decimal AvgLifetimeValue { get; set; }
        public int GoingQuiet { get; set; }
    }
}
