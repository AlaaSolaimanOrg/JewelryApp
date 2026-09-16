using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Analytics.Queries.GetStockByCategory
{
    public class GetStockByCategoryHandler : IRequestHandler<GetStockByCategoryQuery, GenericResponse<List<StockByCategoryVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetStockByCategoryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<StockByCategoryVM>>> Handle(GetStockByCategoryQuery request, CancellationToken cancellationToken)
        {
            var inStockProducts = await _context.Products
                .AsNoTracking()
                .Where(p => p.Quantity > 0 && p.Category.HasValue)
                .Select(p => new { p.Id, p.KaratType, p.Type, p.Category, p.Weight, p.Quantity })
                .ToListAsync(cancellationToken);

            var pricingSettings = await _context.PricingSettings
                .AsNoTracking()
                .ToDictionaryAsync(ps => new { ps.KaratType, ps.ProductType }, ps => ps.Price, cancellationToken);

            var productIds = inStockProducts.Select(p => p.Id).ToList();
            var specialPricings = await _context.ProductSpecialPricings
                .AsNoTracking()
                .Where(x => productIds.Contains(x.ProductId))
                .ToDictionaryAsync(x => x.ProductId, x => x.SpecialPricePerGram, cancellationToken);

            decimal PricePerGram(Guid id, KaratType karat, ProductType type) =>
                specialPricings.TryGetValue(id, out var sp) ? sp : pricingSettings.GetValueOrDefault(new { KaratType = karat, ProductType = type }, 0m);

            var byCategory = inStockProducts
                .GroupBy(p => p.Category!.Value)
                .Select(g => new StockByCategoryVM
                {
                    CategoryName = g.Key.ToString(),
                    Items = g.Sum(p => p.Quantity ?? 1),
                    Value = g.Sum(p => p.Weight * (p.Quantity ?? 1) * PricePerGram(p.Id, p.KaratType, p.Type)),
                })
                .OrderByDescending(c => c.Value)
                .ToList();

            return new GenericResponse<List<StockByCategoryVM>>
            {
                Data = byCategory,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
