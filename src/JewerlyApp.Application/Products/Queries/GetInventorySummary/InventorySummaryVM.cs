namespace JewerlyApp.Application.Products.Queries.GetInventorySummary
{
    public class InventorySummaryVM
    {
        public int TotalProducts { get; set; }
        public int TotalQuantity { get; set; }
        public decimal TotalWeight { get; set; }
        public decimal TotalValue { get; set; }
    }
}
