using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.UsedGold.Queries.GetPeriodStats
{
    public class GetPeriodStatsHandler : IRequestHandler<GetPeriodStatsQuery, GenericResponse<UsedGoldPeriodStatsDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetPeriodStatsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<UsedGoldPeriodStatsDto>> Handle(GetPeriodStatsQuery request, CancellationToken cancellationToken)
        {
            var (startUtc, endUtc) = UsedGoldDateRangeHelper.GetRange(request.Period, request.Month, request.Year);

            var periodItems = await _context.UsedGoldPurchaseItems
                .Where(i => (startUtc == null || i.CreatedDate >= startUtc) && (endUtc == null || i.CreatedDate <= endUtc))
                .Select(i => new { i.Subtotal, i.Purchase.PayMethod })
                .ToListAsync(cancellationToken);

            var result = new UsedGoldPeriodStatsDto
            {
                PurchaseCount = periodItems.Count,
                Spent = periodItems.Sum(i => i.Subtotal),
                SpentCash = periodItems.Where(i => i.PayMethod == UsedGoldPayMethod.Cash).Sum(i => i.Subtotal),
                SpentCard = periodItems.Where(i => i.PayMethod == UsedGoldPayMethod.Card).Sum(i => i.Subtotal),
            };

            return GenericResponse<UsedGoldPeriodStatsDto>.Success(result);
        }
    }
}
