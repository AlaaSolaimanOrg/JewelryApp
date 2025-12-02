using JewerlyApp.Application.Sales.Queries.GetSaleById;

namespace JewerlyApp.Application.Sales.Queries.SearchSales
{
    public class SearchSalesVM
    {
        public Guid Id { get; set; }
        public string? SerialNumber { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string StaffName { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public decimal? CashAmount { get; set; }
        public decimal? CardAmount { get; set; }
        public decimal? Tax { get; set; }
        public decimal? Discount { get; set; }
        public decimal? TotalReturnAmount { get; set; }
        public List<SaleItemVM> SaleItems { get; set; } = new();
    }
}
