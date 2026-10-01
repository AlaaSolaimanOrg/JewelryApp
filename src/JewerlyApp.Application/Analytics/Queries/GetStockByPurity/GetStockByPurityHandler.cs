using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Analytics.Queries.GetStockByPurity
{
    public class GetStockByPurityHandler : IRequestHandler<GetStockByPurityQuery, GenericResponse<List<StockByPurityVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetStockByPurityHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<StockByPurityVM>>> Handle(GetStockByPurityQuery request, CancellationToken cancellationToken)
        {
            var inStockProducts = await _context.Products
                .AsNoTracking()
                .Where(p => p.Quantity > 0)
                .Select(p => new { p.Id, p.KaratType, p.Type, p.Weight, p.Quantity })
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

            var byPurity = inStockProducts
                .GroupBy(p => p.KaratType)
                .Select(g => new StockByPurityVM
                {
                    KaratType = (int)g.Key,
                    Grams = g.Sum(p => p.Weight * (p.Quantity ?? 1)),
                    Items = g.Sum(p => p.Quantity ?? 1),
                    Value = g.Sum(p => p.Weight * (p.Quantity ?? 1) * PricePerGram(p.Id, p.KaratType, p.Type)),
                })
                .OrderByDescending(p => p.Grams)
                .ToList();

            return new GenericResponse<List<StockByPurityVM>>
            {
                Data = byPurity,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
