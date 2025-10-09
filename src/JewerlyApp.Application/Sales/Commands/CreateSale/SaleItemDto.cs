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
        public Guid ProductId { get; set; }
        public KaratType KaratType { get; set; }
        public decimal Weight { get; set; }
        public bool IsManualProduct { get; set; }
        public decimal OriginalPricePerGram { get; set; }
        public decimal? OverriddenPricePerGram { get; set; }
    }
}
