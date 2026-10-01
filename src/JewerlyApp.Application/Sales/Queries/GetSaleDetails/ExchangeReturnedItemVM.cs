using JewerlyApp.Domain.Enums;

namespace JewerlyApp.Application.Sales.Queries.GetSaleById
{
    public class ExchangeReturnedItemVM
    {
        public Guid Id { get; set; }
        public Guid ReturnId { get; set; }
        public string ReturnSerialNumber { get; set; } = string.Empty;
        public Guid OriginalSaleId { get; set; }
        public string OriginalSaleSerialNumber { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public string? Sku { get; set; }
        public KaratType Karat { get; set; }
        public decimal Weight { get; set; }
        public int QuantityReturned { get; set; }
        public decimal AmountReturned { get; set; }
        public ReturnReason Reason { get; set; }
        public string? ReasonNote { get; set; }
        public ItemCondition Condition { get; set; }
        public ReturnOption Option { get; set; }
    }
}
