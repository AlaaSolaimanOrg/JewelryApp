namespace JewerlyApp.Application.Sales.Queries.GetTopCustomers
{
    public class TopCustomerVM
    {
        public string Name { get; set; } = string.Empty;
        public int Transactions { get; set; }
        public decimal Spent { get; set; }
    }
}
