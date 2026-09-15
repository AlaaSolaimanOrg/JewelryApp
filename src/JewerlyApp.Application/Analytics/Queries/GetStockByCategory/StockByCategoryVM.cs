namespace JewerlyApp.Application.Analytics.Queries.GetStockByCategory
{
    public class StockByCategoryVM
    {
        public string CategoryName { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public int Items { get; set; }
    }
}
