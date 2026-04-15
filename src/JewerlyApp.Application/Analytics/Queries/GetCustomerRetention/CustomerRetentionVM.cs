namespace JewerlyApp.Application.Analytics.Queries.GetCustomerRetention
{
    public class CustomerRetentionVM
    {
        public string Label { get; set; } = default!;
        public int Count { get; set; }
        public decimal Percentage { get; set; }
    }
}
