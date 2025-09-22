using JewerlyApp.Domain.Entities.Common;
using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Domain.Entities
{
    public class Cart : Entity<Guid>
    {
        public decimal SubTotal {  get; set; }
        public decimal Total {  get; set; }
        public decimal Taxes { get; set; }
        public decimal? Discount {  get; set; }
        public decimal Total { get; set; }
        public DiscountType DiscountType { get; set; }
        public ICollection<CartProduct> Products { get; set; }      

    }
}
