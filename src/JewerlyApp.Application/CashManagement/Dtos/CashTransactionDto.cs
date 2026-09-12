using JewerlyApp.Domain.Enums;
using System;

namespace JewerlyApp.Application.CashManagement.Dtos
{
    public class CashTransactionDto
    {
        public Guid Id { get; set; }
        public CashBoxType BoxType { get; set; }
        public CashTransactionType Type { get; set; }
        public decimal Amount { get; set; }
        public bool IsCredit { get; set; }
        public string? Category { get; set; }
        public string? CustomerName { get; set; }
        public string? Destination { get; set; }
        public string? Notes { get; set; }
        public Guid? SaleId { get; set; }
        public string? SaleSerialNumber { get; set; }
        public string? CreatedByName { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
