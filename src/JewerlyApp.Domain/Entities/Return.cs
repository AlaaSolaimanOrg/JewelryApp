using JewerlyApp.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Domain.Entities
{
    public class Return : Entity<Guid>
    {
        public string SerialNumber { get; set; } = default!;
        public Guid SaleId { get; set; }
        public Guid? ExchangeSaleId { get; set; }
        public decimal TotalAmount { get; set; }
        public Sale Sale { get; set; } = default!;
        public Sale? ExchangeSale { get; set; }
        public List<ReturnItem> Items { get; set; } = new();
    }

}
