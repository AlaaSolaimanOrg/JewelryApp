using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
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
            var pools = await UsedGoldPoolCalculator.GetPoolsAsync(_context, cancellationToken);

            var poolDtos = pools.ToDictionary(
                kv => kv.Key,
                kv => new GoldPoolDto
                {
                    Weight = kv.Value.Weight,
                    Cost = kv.Value.Cost,
                    TotalInvested = kv.Value.TotalInvested,
                });

            var (startUtc, endUtc) = UsedGoldDateRangeHelper.GetRange(request.Period, request.Month, request.Year);

            var periodItems = await _context.UsedGoldPurchaseItems
                .Where(i => (startUtc == null || i.CreatedDate >= startUtc) && (endUtc == null || i.CreatedDate <= endUtc))
                .Select(i => i.Subtotal)
                .ToListAsync(cancellationToken);

            var result = new GetPoolsResultDto
            {
                Pools = poolDtos,
                PeriodPurchaseCount = periodItems.Count,
                PeriodSpent = periodItems.Sum(),
            };

            return GenericResponse<GetPoolsResultDto>.Success(result);
        }
    }
}
