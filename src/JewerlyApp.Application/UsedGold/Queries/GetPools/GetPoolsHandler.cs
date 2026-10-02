using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.UsedGold.Queries.GetPools
{
    public class GetPoolsHandler : IRequestHandler<GetPoolsQuery, GenericResponse<GetPoolsResultDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetPoolsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<GetPoolsResultDto>> Handle(GetPoolsQuery request, CancellationToken cancellationToken)
        {
            var (startUtc, endUtc) = UsedGoldDateRangeHelper.GetRange(request.Period, request.Month, request.Year);

            var currentPools = await UsedGoldPoolCalculator.GetPoolsAsync(_context, cancellationToken);
            var periodEndPools = await UsedGoldPoolCalculator.GetPoolsAsync(_context, cancellationToken, endUtc);

            var periodItems = await _context.UsedGoldPurchaseItems
                .Where(i => (startUtc == null || i.CreatedDate >= startUtc) && (endUtc == null || i.CreatedDate <= endUtc))
                .Select(i => new { i.Subtotal, i.Purchase.PayMethod })
                .ToListAsync(cancellationToken);

            var result = new GetPoolsResultDto
            {
                Pools = ToDtos(periodEndPools),
                CurrentPools = ToDtos(currentPools),
                PeriodPurchaseCount = periodItems.Count,
                PeriodSpent = periodItems.Sum(i => i.Subtotal),
                PeriodSpentCash = periodItems.Where(i => i.PayMethod == UsedGoldPayMethod.Cash).Sum(i => i.Subtotal),
                PeriodSpentCard = periodItems.Where(i => i.PayMethod == UsedGoldPayMethod.Card).Sum(i => i.Subtotal),
            };

            return GenericResponse<GetPoolsResultDto>.Success(result);
        }

        private static Dictionary<int, GoldPoolDto> ToDtos(Dictionary<int, GoldPoolBalance> pools) =>
            pools.ToDictionary(
                kv => kv.Key,
                kv => new GoldPoolDto
                {
                    Weight = kv.Value.Weight,
                    Cost = kv.Value.Cost,
                    TotalInvested = kv.Value.TotalInvested,
                });
    }
}
