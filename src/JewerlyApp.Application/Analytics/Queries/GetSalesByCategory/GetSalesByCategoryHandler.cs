using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Analytics.Queries.GetSalesByCategory
{
    public class GetSalesByCategoryHandler : IRequestHandler<GetSalesByCategoryQuery, GenericResponse<List<SalesByCategoryVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetSalesByCategoryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<SalesByCategoryVM>>> Handle(GetSalesByCategoryQuery request, CancellationToken cancellationToken)
        {
            var query = _context.SaleItems
                .AsNoTracking()
                .Include(si => si.Product)
                .Include(si => si.Sale)
                .AsQueryable();

            var range = request.ResolveDateRange();
            var dateFrom = range.StartUtc ?? DateTime.MinValue;
            var dateTo = range.EndUtc ?? DateTime.MaxValue;

            query = query.Where(si => si.Sale!.CreatedDate >= dateFrom && si.Sale!.CreatedDate <= dateTo);

            // Prorate each item's SubTotal by its sale's Total/SubTotal ratio so category revenue
            // reflects actual post-discount/trade-in/exchange revenue, consistent with Sale.Total.
            var categorySales = await query
                .Where(si => si.Product != null && si.Product.Category != null)
                .Select(si => new
                {
                    si.Product!.Category,
                    AdjustedRevenue = si.Sale!.SubTotal > 0
                        ? si.SubTotal * (si.Sale.Total / si.Sale.SubTotal)
                        : 0
                })
                .GroupBy(x => x.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    Revenue = g.Sum(x => x.AdjustedRevenue)
                })
                .ToListAsync(cancellationToken);

            var totalRevenue = categorySales.Sum(x => x.Revenue);

            var withRawPercentage = categorySales
                .Select(x => new
                {
                    x.Category,
                    x.Revenue,
                    RawPercentage = totalRevenue > 0 ? (x.Revenue / totalRevenue) * 100 : 0
                })
                .ToList();

            var percentageByCategory = ApplyLargestRemainderRounding(
                withRawPercentage.Select(x => x.RawPercentage).ToList());

            var result = withRawPercentage
                .Select((x, i) => new SalesByCategoryVM
                {
                    CategoryName = x.Category.ToString()!,
                    Revenue = x.Revenue,
                    Percentage = percentageByCategory[i]
                })
                .OrderByDescending(x => x.Revenue)
                .ToList();

            return new GenericResponse<List<SalesByCategoryVM>>
            {
                Data = result,
                StatusCode = Domain.Enums.ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }

        private static List<decimal> ApplyLargestRemainderRounding(List<decimal> rawPercentages)
        {
            var floors = rawPercentages.Select(p => Math.Floor(p)).ToList();
            var remainders = rawPercentages.Select((p, i) => p - floors[i]).ToList();

            var pointsToDistribute = (int)(100 - floors.Sum());

            var order = Enumerable.Range(0, rawPercentages.Count)
                .OrderByDescending(i => remainders[i])
                .ToList();

            var rounded = new List<decimal>(floors);
            for (int i = 0; i < pointsToDistribute && i < order.Count; i++)
            {
                rounded[order[i]] += 1;
            }

            return rounded;
        }
    }
}
