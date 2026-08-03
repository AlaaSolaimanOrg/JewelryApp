using JewerlyApp.Domain.Entities;
using Microsoft.AspNetCore.Identity;
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
        DbSet<Customer> Customers { get; set; }
        DbSet<Sale> Sales { get; set; }
        DbSet<SaleItem> SaleItems { get; set; }
        DbSet<ApplicationUser> Users { get; set; }
        DbSet<ApplicationRole> Roles { get; set; }
        DbSet<IdentityUserRole<int>> UserRoles { get; set; }
        DbSet<ProductTag> ProductTags { get; set; }
        DbSet<Log> Logs { get; set; }
        DbSet<Return> Returns { get; set; }
        DbSet<ReturnItem> ReturnItems { get; set; }
        DbSet<Repair> Repairs { get; set; }
        DbSet<JewerlyApp.Domain.Entities.MeltRecord> MeltRecords { get; set; }
        DbSet<PricingSettingLog> PricingSettingLogs { get; set; }
        DbSet<PrintJob> PrintJobs { get; set; }
        DbSet<Printer> Printers { get; set; }
        DbSet<ProductSpecialPricing> ProductSpecialPricings { get; set; }


        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
