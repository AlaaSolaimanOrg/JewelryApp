using JewerlyApp.Domain.Enums;
using System;

namespace JewerlyApp.Application.Returns.Queries.GetReturnItems
{
    public class ReturnItemFlatDto
    {
        public Guid Id { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? Sku { get; set; }
        public KaratType Karat { get; set; }
        public decimal Weight { get; set; }
        public int QuantityReturned { get; set; }
        public decimal AmountReturned { get; set; }
        public string? ProductImage { get; set; }

        public ReturnReason Reason { get; set; }
        public string? ReasonNote { get; set; }
        public ItemCondition Condition { get; set; }
        public ReturnOption Option { get; set; }

        public string CustomerName { get; set; } = string.Empty;
        public string? CustomerPhone { get; set; }
        public string SaleSerialNumber { get; set; } = string.Empty;
        public DateTime? ReturnDate { get; set; }

        public bool IsTagPrinted { get; set; }
        public DateTime? TagPrintedDate { get; set; }
    }
}
