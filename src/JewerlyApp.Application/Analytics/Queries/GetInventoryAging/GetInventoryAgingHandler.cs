using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Analytics.Queries.GetInventoryAging
{
    public class GetInventoryAgingHandler : IRequestHandler<GetInventoryAgingQuery, GenericResponse<InventoryAgingVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetInventoryAgingHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<InventoryAgingVM>> Handle(GetInventoryAgingQuery request, CancellationToken cancellationToken)
        {
            var now = DateTime.UtcNow;

            // --- In-stock products ---
            var inStockProducts = await _context.Products
                .AsNoTracking()
                .Where(p => p.Quantity > 0 && p.CreatedDate != null)
                .Select(p => new
                {
                    p.Sku,
                    p.Name,
                    p.Category,
                    p.KaratType,
                    p.Type,
                    p.Weight,
                    p.Quantity,
                    p.CreatedDate
                })
                .ToListAsync(cancellationToken);

            // --- Pricing lookup ---
            var pricingSettings = await _context.PricingSettings
                .AsNoTracking()
                .ToDictionaryAsync(
                    ps => new { ps.KaratType, ps.ProductType },
                    ps => ps.Price,
                    cancellationToken
                );

            // --- Build enriched list ---
            var enriched = inStockProducts.Select(p =>
            {
                var days = (int)(now - p.CreatedDate!.Value).TotalDays;
                var pricePerGram = pricingSettings.GetValueOrDefault(new { p.KaratType, ProductType = p.Type }, 0m);
                var estimatedValue = p.Weight * pricePerGram * (p.Quantity ?? 1);

                return new
                {
                    p.Sku,
                    p.Name,
                    p.Category,
                    p.KaratType,
                    p.Quantity,
                    DaysInInventory = days,
                    EstimatedValue = estimatedValue
                };
            }).ToList();

            var totalItems = enriched.Count;

            // --- Aging buckets ---
            var bucketDefs = new[]
            {
                (Label: "0-30 days",  Min: 0,  Max: 30),
                (Label: "31-60 days", Min: 31, Max: 60),
                (Label: "61-90 days", Min: 61, Max: 90),
                (Label: "90+ days",   Min: 91, Max: int.MaxValue),
            };

            var agingBuckets = bucketDefs.Select(b =>
            {
                var items = enriched.Where(p => p.DaysInInventory >= b.Min && p.DaysInInventory <= b.Max).ToList();
                return new AgingBucketVM
                {
                    Label = b.Label,
                    ItemCount = items.Count,
                    TotalEstimatedValue = items.Sum(p => p.EstimatedValue),
                    Percentage = totalItems > 0
                        ? Math.Round((decimal)items.Count / totalItems * 100, 1)
                        : 0m
                };
            }).ToList();

            // --- Oldest 20 items ---
            var oldestItems = enriched
                .OrderByDescending(p => p.DaysInInventory)
                .Take(20)
                .Select(p => new AgingItemVM
                {
                    Sku = p.Sku ?? string.Empty,
                    Name = p.Name,
                    Category = p.Category,
                    KaratType = p.KaratType,
                    DaysInInventory = p.DaysInInventory,
                    EstimatedValue = p.EstimatedValue,
                    Quantity = p.Quantity ?? 1
                })
                .ToList();

            // --- Average days in inventory ---
            var avgDays = enriched.Count > 0
                ? enriched.Average(p => p.DaysInInventory)
                : 0d;

            // --- Average turnover (days from creation to sale, from sold items) ---
            var soldItems = await _context.SaleItems
                .AsNoTracking()
                .Where(si => si.CreatedDate != null && si.Product != null && si.Product.CreatedDate != null)
                .Select(si => new { si.CreatedDate, ProductCreatedDate = si.Product!.CreatedDate })
                .ToListAsync(cancellationToken);

            var avgTurnover = soldItems.Count > 0
                ? soldItems.Average(si => (si.CreatedDate!.Value - si.ProductCreatedDate!.Value).TotalDays)
                : 0d;

            return new GenericResponse<InventoryAgingVM>
            {
                Data = new InventoryAgingVM
                {
                    AverageDaysInInventory = Math.Round(avgDays, 1),
                    AverageTurnoverDays = Math.Round(avgTurnover, 1),
                    AgingBuckets = agingBuckets,
                    OldestItems = oldestItems
                },
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
