using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Entities.Common;
using JewerlyApp.Domain.ValueObjects;
using JewerlyApp.Infrastructure.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Reflection.Emit;
using System.Security.Claims;
using System.Text.Json;

namespace JewerlyApp.Infrastructure.Context
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>, IApplicationDbContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IHttpContextAccessor httpContextAccessor)
            : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        // Your custom DbSets go here
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<ProductImage> ProductImages { get; set; }
        public virtual DbSet<SkuSequence> SkuSequences { get; set; }
        public virtual DbSet<PricingSetting> PricingSettings { get; set; }
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<Sale> Sales { get; set; }
        public virtual DbSet<SaleItem> SaleItems { get; set; }
        public virtual DbSet<ProductTag> ProductTags { get; set; }
        public virtual DbSet<Log> Logs { get; set; }
        public virtual DbSet<Return> Returns { get; set; }
        public virtual DbSet<ReturnItem> ReturnItems { get; set; }
        public virtual DbSet<Repair> Repairs { get; set; }
        public virtual DbSet<RepairItem> RepairItems { get; set; }
        public virtual DbSet<PricingSettingLog> PricingSettingLogs { get; set; }
        public virtual DbSet<PrintJob> PrintJobs { get; set; }
        public virtual DbSet<Printer> Printers { get; set; }



        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            int? currentUserId = GetCurrentUserId();

            foreach (var entry in ChangeTracker.Entries<IEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.AddCreatedByData(currentUserId);
                        break;

                    case EntityState.Modified:
                        entry.Entity.AddUpdatedByData(currentUserId);
                        break;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }

        private int? GetCurrentUserId()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user == null)
                return null;

            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return 1;

            if (int.TryParse(userIdClaim.Value, out int userId))
                return userId;

            return 1;
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            var receiptPayloadComparer = new ValueComparer<ReceiptPrintPayload>(
                (left, right) => JsonSerializer.Serialize(left, (JsonSerializerOptions?)null) == JsonSerializer.Serialize(right, (JsonSerializerOptions?)null),
                value => JsonSerializer.Serialize(value, (JsonSerializerOptions?)null).GetHashCode(),
                value => JsonSerializer.Deserialize<ReceiptPrintPayload>(JsonSerializer.Serialize(value, (JsonSerializerOptions?)null), (JsonSerializerOptions?)null) ?? new ReceiptPrintPayload());

            builder.Entity<PrintJob>(entity =>
            {
                entity.HasKey(x => x.Id);
                entity.Property(x => x.StoreId).IsRequired().HasMaxLength(64);
                entity.Property(x => x.PrinterId).IsRequired().HasMaxLength(64);
                entity.Property(x => x.Status).IsRequired();
                entity.Property(x => x.Payload)
                    .HasConversion(
                        payload => JsonSerializer.Serialize(payload, (JsonSerializerOptions?)null),
                        value => JsonSerializer.Deserialize<ReceiptPrintPayload>(value, (JsonSerializerOptions?)null) ?? new ReceiptPrintPayload())
                    .Metadata.SetValueComparer(receiptPayloadComparer);
                entity.Property(x => x.CreatedAt).IsRequired();
                entity.Property(x => x.FailureReason).HasMaxLength(512);
                entity.HasIndex(x => new { x.StoreId, x.PrinterId, x.Status, x.CreatedAt });
            });

            builder.Entity<Printer>(entity =>
            {
                entity.HasKey(x => x.Id);
                entity.Property(x => x.StoreId).IsRequired().HasMaxLength(64);
                entity.Property(x => x.Code).IsRequired().HasMaxLength(64);
                entity.Property(x => x.Name).IsRequired().HasMaxLength(128);
                entity.Property(x => x.IsActive).IsRequired();
                entity.HasIndex(x => new { x.StoreId, x.Code }).IsUnique();
            });

            builder.Entity<ReturnItem>()
            .HasOne(r => r.SaleItem)
            .WithMany(s => s.ReturnItems)
            .HasForeignKey(r => r.SaleItemId)
            .OnDelete(DeleteBehavior.Restrict);

            // Precision Configuration
            builder.Entity<Sale>(entity =>
            {
                entity.Property(e => e.Discount).HasPrecision(18, 2);
                entity.Property(e => e.DiscountPercentage).HasPrecision(18, 2);
                entity.Property(e => e.CashAmount).HasPrecision(18, 2);
                entity.Property(e => e.CardAmount).HasPrecision(18, 2);
                entity.Property(e => e.SubTotal).HasPrecision(18, 2);
                entity.Property(e => e.Total).HasPrecision(18, 2);
            });

            builder.Entity<SaleItem>(entity =>
            {
                entity.Property(e => e.Weight).HasPrecision(18, 2);
                entity.Property(e => e.OriginalPricePerGram).HasPrecision(18, 2);
                entity.Property(e => e.OverriddenPricePerGram).HasPrecision(18, 2);
                entity.Property(e => e.SubTotal).HasPrecision(18, 2);
            });

            builder.Entity<Return>(entity =>
            {
                entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
            });

            builder.Entity<ReturnItem>(entity =>
            {
                entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
                entity.Property(e => e.ReturnAmount).HasPrecision(18, 2);
            });

            builder.Entity<Repair>(entity =>
            {
                entity.Property(e => e.TotalCost).HasPrecision(18, 2);
            });

            builder.Entity<RepairItem>(entity =>
            {
                entity.Property(e => e.Weight).HasPrecision(18, 2);
                entity.Property(e => e.Cost).HasPrecision(18, 2);
                entity.Property(e => e.DepositPaid).HasPrecision(18, 2);
            });
        }
    }
}
