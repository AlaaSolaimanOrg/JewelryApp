using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Commands.CreateSale
{
    public class SaleItemDto
    {
        public Guid? ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public KaratType KaratType { get; set; }
        public decimal Weight { get; set; }
        public bool IsManualProduct { get; set; }
        public bool IsNewProduct { get; set; }
        public ProductCategory? Category { get; set; }
        public ProductType ProductType { get; set; }
        public string? Specification { get; set; }
        public int StockQuantity { get; set; }
        public decimal OriginalPricePerGram { get; set; }
        public decimal? OverriddenPricePerGram { get; set; }
        public int Quantity { get; set; }
    }
}
