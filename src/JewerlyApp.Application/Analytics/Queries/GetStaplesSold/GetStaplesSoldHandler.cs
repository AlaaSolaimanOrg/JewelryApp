using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.InventorySettings;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Analytics.Queries.GetStaplesSold
{
    public class GetStaplesSoldHandler : IRequestHandler<GetStaplesSoldQuery, StaplesSoldResponse>
    {
        private const string LiraTag = "lira";
        private const string OunceTag = "ounce";

        private readonly IApplicationDbContext _context;

        public GetStaplesSoldHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        private static string BuildType(KaratType karatType, decimal weight, List<string> tags)
        {
            var kind = "bullion";
            if (tags.Any(t => string.Equals(t, LiraTag, StringComparison.OrdinalIgnoreCase)))
            {
                kind = LiraTag;
            }
            else if (tags.Any(t => string.Equals(t, OunceTag, StringComparison.OrdinalIgnoreCase)))
            {
                kind = OunceTag;
            }

            return $"{(int)karatType}K {kind} · {weight.ToString("0.##", CultureInfo.InvariantCulture)}g";
        }

        public async Task<StaplesSoldResponse> Handle(GetStaplesSoldQuery request, CancellationToken cancellationToken)
        {
            var lowStockThreshold = await LowStockThresholdResolver.GetCurrentThresholdAsync(_context, cancellationToken);

            var bullionProducts = await _context.Products
                .AsNoTracking()
                .Where(p => p.Category == ProductCategory.Bullion)
                .Select(p => new
                {
                    p.Name,
                    p.KaratType,
                    p.Weight,
                    p.Quantity,
                    Tags = p.Tags.Select(t => t.Tag).ToList(),
                })
                .ToListAsync(cancellationToken);

            var stockByName = bullionProducts
                .Where(p => !string.IsNullOrEmpty(p.Name))
                .GroupBy(p => p.Name!)
                .ToDictionary(
                    g => g.Key,
                    g => new { Stock = g.Sum(p => p.Quantity ?? 1), Type = BuildType(g.First().KaratType, g.First().Weight, g.First().Tags) });

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
                        Type = stockInfo?.Type,
                        Stock = stock,
                        Sold = soldByName.GetValueOrDefault(name),
                        IsLow = stock <= lowStockThreshold,
                    };
                })
                .ToList();

            var sortBy = string.IsNullOrWhiteSpace(request.SortBy) ? nameof(StapleSoldVM.Sold) : request.SortBy;
            var sortDirection = string.IsNullOrWhiteSpace(request.SortBy) ? SortDirection.Descending : request.SortDirection;

            var paged = staples
                .AsQueryable()
                .ApplySorting(sortBy, sortDirection)
                .ApplyPagination(request.PageNumber, request.PageSize)
                .ToList();

            return new StaplesSoldResponse
            {
                Data = paged,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = staples.Count,
                TotalSold = staples.Sum(s => s.Sold),
            };
        }
    }
}
