namespace JewerlyApp.Application.Repairs.Queries.GetRepairsByCustomer
{
    public class CustomerRevenueVM
    {
        public string Name { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int Count { get; set; }
    }
}
