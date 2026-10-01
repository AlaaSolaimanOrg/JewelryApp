namespace JewerlyApp.Application.Customers.Queries.GetAtRiskCustomers
{
    public class AtRiskCustomerVM
    {
        public string Name { get; set; } = string.Empty;
        public decimal Lifetime { get; set; }
        public int Purchases { get; set; }
        public int DaysSinceLastPurchase { get; set; }
    }
}
