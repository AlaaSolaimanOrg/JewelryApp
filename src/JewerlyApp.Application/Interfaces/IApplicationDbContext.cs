using JewerlyApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Interfaces
{
    /// <summary>
    /// Represents the application's database context interface.
    /// This defines the contract for all data access and is used to
    /// enable dependency injection and unit testing.
    /// </summary>
    public interface IApplicationDbContext
    {
        DbSet<Product> Products { get; set; }
        DbSet<ProductImage> ProductImages { get; set; }
        DbSet<SkuSequence> SkuSequences { get; }
        DbSet<PricingSetting> PricingSettings { get; }
        DbSet<Cart> Carts { get; set; }
        DbSet<CartProduct> CartProducts { get; set; }
        DbSet<Customer> Customers { get; set; }
        DbSet<Sale> Sales { get; set; }
        DbSet<SaleItem> SaleItems { get; set; }


        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
