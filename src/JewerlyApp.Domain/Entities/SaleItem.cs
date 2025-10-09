using JewerlyApp.Domain.Entities.Common;
using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Domain.Entities
{
    public class SaleItem : Entity<Guid>
    {
        public Guid SaleId { get; set; }
        public Guid ProductId { get; set; }
        public KaratType KaratType { get; set; }
        public decimal Weight { get; set; }
        public decimal? OriginalPricePerGram { get; set; }
        public decimal? OverriddenPricePerGram { get; set; }
        public decimal SubTotal { get; set; }
        public Product? Product { get; set; }
        public Sale? Sale { get; set; }

    }
}
