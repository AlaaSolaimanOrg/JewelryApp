namespace JewerlyApp.Application.Analytics.Queries.GetInventoryStockSummary
{
    public class InventoryStockSummaryVM
    {
        public int ItemsInStock { get; set; }
        public int CategoriesCount { get; set; }
        public decimal TotalWeight { get; set; }
        public decimal StockValue { get; set; }
    }
}
