using JewerlyApp.Domain.Entities.Common;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace JewerlyApp.Domain.Entities
{
    public class CartProduct : Entity<Guid>
    {        
        public Guid CartId { get; set; }  
        public Guid ProductId { get; set; }
        [Column(TypeName = "decimal(18,4)")]
        public decimal? OriginalPricePerGram { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal? OverriddenPricePerGram { get; set; }
        public Cart? Cart { get; set; }
        public Product? Product { get; set; }
    }
}
