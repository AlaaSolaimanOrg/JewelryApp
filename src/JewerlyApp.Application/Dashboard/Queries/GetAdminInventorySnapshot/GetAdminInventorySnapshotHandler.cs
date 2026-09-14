using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Dashboard.Dtos;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Dashboard.Queries.GetAdminInventorySnapshot
{
    public class GetAdminInventorySnapshotHandler : IRequestHandler<GetAdminInventorySnapshotQuery, GenericResponse<AdminInventorySnapshotDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetAdminInventorySnapshotHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<AdminInventorySnapshotDto>> Handle(GetAdminInventorySnapshotQuery request, CancellationToken cancellationToken)
        {
            var (todayStartUtc, todayEndUtc) = BusinessTimeZoneHelper.GetUtcBoundsForEdmontonDate(BusinessTimeZoneHelper.GetEdmontonDate());

            // ---- Stock value ----
            var products = await _context.Products
                .AsNoTracking()
                .Select(p => new { p.Id, p.Weight, p.Quantity, p.KaratType, p.Type })
                .ToListAsync(cancellationToken);

            var pricingSettings = await _context.PricingSettings
                .AsNoTracking()
                .ToDictionaryAsync(ps => new { ps.KaratType, ps.ProductType }, ps => ps.Price, cancellationToken);

            var productIds = products.Select(p => p.Id).ToList();
            var specialPricings = await _context.ProductSpecialPricings
                .AsNoTracking()
                .Where(x => productIds.Contains(x.ProductId))
                .ToDictionaryAsync(x => x.ProductId, x => x.SpecialPricePerGram, cancellationToken);

            var pricedProducts = products.Select(p =>
            {
                var pricePerGram = specialPricings.TryGetValue(p.Id, out var sp)
                    ? sp
                    : pricingSettings.GetValueOrDefault(new { p.KaratType, ProductType = p.Type }, 0);

                return new
                {
                    Quantity = p.Quantity ?? 0,
                    p.Weight,
                    Price = p.Weight * pricePerGram,
                };
            }).ToList();

            var stockValue = new StockValueDto
            {
                Amount = pricedProducts.Sum(p => p.Price * p.Quantity),
                Items = pricedProducts.Sum(p => p.Quantity),
                Weight = pricedProducts.Sum(p => p.Weight * p.Quantity),
            };

            // ---- Refunds paid out (today) ----
            var returnsToday = await _context.Returns
                .AsNoTracking()
                .Where(r => r.CreatedDate.HasValue && r.CreatedDate.Value >= todayStartUtc && r.CreatedDate.Value <= todayEndUtc)
                .Select(r => new
                {
                    r.TotalAmount,
                    Options = r.Items.Select(i => i.Option).ToList(),
                })
                .ToListAsync(cancellationToken);

            var refundsPaidOut = new RefundsPaidOutDto
            {
                Amount = returnsToday.Sum(r => r.TotalAmount),
                Returns = returnsToday.Count,
                ToStock = returnsToday.Sum(r => r.Options.Count(o => o == ReturnOption.ReturnToStock)),
                ToMelt = returnsToday.Sum(r => r.Options.Count(o => o == ReturnOption.MeltAfterReturn)),
            };

            var dto = new AdminInventorySnapshotDto
            {
                StockValue = stockValue,
                RefundsPaidOut = refundsPaidOut,
            };

            return GenericResponse<AdminInventorySnapshotDto>.Success(dto);
        }
    }
}
