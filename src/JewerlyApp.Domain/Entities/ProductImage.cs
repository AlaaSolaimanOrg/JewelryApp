using JewerlyApp.Domain.Entities.Common;
using System;

namespace JewerlyApp.Domain.Entities
{
    public class ProductImage : Entity<Guid>
    {
        public Guid ProductId { get; set; }       
        public string? ImageUrl { get; set; }      
        public string? AltText { get; set; }      
        public bool IsMain { get; set; }
        public Product? Product { get; set; }
        
    }
}
