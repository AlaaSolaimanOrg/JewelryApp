using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace JewerlyApp.Domain.Entities
{
    public class CartProduct
    {
        //Identifier for the CartProduct record.
        public Guid Id { get; set; }

        /// The Foreign key to the Cart entity.
        public Guid CartId { get; set; }
  
        /// The foreign key to the Product entity.
        public Guid ProductId { get; set; }
 
        /// The number of this product in the cart.
        public int Quantity { get; set; }

        /// The price per gram for this product, if it has been overridden.
        /// This allows for custom pricing per cart item.
        [Column(TypeName = "decimal(18,2)")]
        public decimal OverriddenPricePerGram { get; set; }

        // Navigation properties
        public Cart Cart { get; set; }
        public Product Product { get; set; }
    }
}
