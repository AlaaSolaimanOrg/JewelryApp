using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Analytics.Queries.GetStaplesSold
{
    public class GetStaplesSoldHandler : IRequestHandler<GetStaplesSoldQuery, GenericResponse<List<StapleSoldVM>>>
    {
        // No per-item reorder threshold exists in the data model yet; staples at or
        // below this stock count are flagged as low so buyers know to reorder.
        private const int LowStockThreshold = 10;

        private readonly IApplicationDbContext _context;

        public GetStaplesSoldHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<StapleSoldVM>>> Handle(GetStaplesSoldQuery request, CancellationToken cancellationToken)
        {
            var bullionProducts = await _context.Products
                .AsNoTracking()
                .Where(p => p.Category == ProductCategory.Bullion)
                .Select(p => new { p.Name, p.Specification, p.Quantity })
                .ToListAsync(cancellationToken);

            var stockByName = bullionProducts
                .Where(p => !string.IsNullOrEmpty(p.Name))
                .GroupBy(p => p.Name!)
                .ToDictionary(
                    g => g.Key,
                    g => new { Stock = g.Sum(p => p.Quantity ?? 1), Specification = g.FirstOrDefault(p => p.Specification != null)?.Specification });

            var soldQuery = _context.SaleItems
                .AsNoTracking()
                .Where(si => si.Product != null && si.Product.Category == ProductCategory.Bullion);

            if (request.DateFrom.HasValue)
            {
                soldQuery = soldQuery.Where(si => si.CreatedDate >= request.DateFrom.Value);
            }

            if (request.DateTo.HasValue)
            {
                soldQuery = soldQuery.Where(si => si.CreatedDate <= request.DateTo.Value);
            }

            var soldItems = await soldQuery
                .Select(si => new { si.Product!.Name, si.Quantity })
                .ToListAsync(cancellationToken);

            var soldByName = soldItems
                .Where(si => !string.IsNullOrEmpty(si.Name))
                .GroupBy(si => si.Name!)
                .ToDictionary(g => g.Key, g => g.Sum(si => si.Quantity));

            var names = stockByName.Keys.Union(soldByName.Keys);

            var staples = names
                .Select(name =>
                {
                    var stockInfo = stockByName.GetValueOrDefault(name);
                    var stock = stockInfo?.Stock ?? 0;
                    return new StapleSoldVM
                    {
                        Name = name,
                        Specification = stockInfo?.Specification,
                        Stock = stock,
                        Sold = soldByName.GetValueOrDefault(name),
                        IsLow = stock <= LowStockThreshold,
                    };
                })
                .OrderByDescending(s => s.Sold)
                .ToList();

            return new GenericResponse<List<StapleSoldVM>>
            {
                Data = staples,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
