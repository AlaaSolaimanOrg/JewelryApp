namespace JewerlyApp.Application.Analytics.Queries.GetSalesByCategory
{
    public class SalesByCategoryVM
    {
        public string CategoryName { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public decimal Percentage { get; set; }
    }
}
