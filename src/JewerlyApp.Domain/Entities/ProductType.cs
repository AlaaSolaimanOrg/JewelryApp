using System;

namespace JewerlyApp.Domain.Entities
{
    public class ProductTag
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ProductId { get; set; }
        public string Tag { get; set; } = default!;
        public Product Product { get; set; } 
    }
}
