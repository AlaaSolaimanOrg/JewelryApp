using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Domain.Entities
{
    public class Cart
    {
        //Cart Id
        public Guid Id { get ; set; }
        //Customer Id
        public Guid CustomerId { get; set; }
        //Sub Total in case of discounts or sales.
        public decimal SubTotal {  get; set; }
        //Taxes
        public decimal Taxes { get; set; }
        //Discounts
        public decimal Discount {  get; set; }
        //Discount Type If Fixed Values or Percentages
        public Discounts DiscountType { get; set; }
        //Used for Relationship between Cart and Products
        public ICollection<CartProduct> CartProducts { get; set; }

    }
}
