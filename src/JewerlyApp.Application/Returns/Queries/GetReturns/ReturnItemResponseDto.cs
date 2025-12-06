using JewerlyApp.Domain.Enums;

namespace JewerlyApp.Application.Returns.Queries.GetReturns
{
    public class ReturnItemResponseDto
    {
        public Guid Id { get; set; }
        public Guid SaleItemId { get; set; }

        public string? ProductName { get; set; } = "";
        public string? Sku { get; set; } = "";
        public KaratType Karat { get; set; }
        public decimal Weight { get; set; }

        public int QuantityReturned { get; set; }
        public decimal AmountReturned { get; set; }

        public ReturnReason Reason { get; set; }
        public string? ReasonNote { get; set; }

        public ItemCondition Condition { get; set; }
        public ReturnOption Option { get; set; }

        public string? ProductImage { get; set; }
    }

    public class ReturnResponseDto
    {
        public Guid Id { get; set; }
        public Guid SaleId { get; set; }

        public string SaleSerialNumber { get; set; } = "";
        public string CustomerName { get; set; } = "";
        public string? CustomerPhone { get; set; } = "";

        public DateTime? ReturnDate { get; set; }
        public decimal TotalAmountReturned { get; set; }

        public List<ReturnItemResponseDto> Items { get; set; } = new();
    }
}
