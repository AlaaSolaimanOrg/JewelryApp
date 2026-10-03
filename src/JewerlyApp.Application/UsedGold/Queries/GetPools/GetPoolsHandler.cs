using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.UsedGold.Queries.GetPools
{
    public class GetPoolsHandler : IRequestHandler<GetPoolsQuery, GenericResponse<Dictionary<int, GoldPoolDto>>>
    {
        private readonly IApplicationDbContext _context;

        public GetPoolsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<Dictionary<int, GoldPoolDto>>> Handle(GetPoolsQuery request, CancellationToken cancellationToken)
        {
            var pools = await UsedGoldPoolCalculator.GetPoolsAsync(_context, cancellationToken);

            var result = pools.ToDictionary(
                kv => kv.Key,
                kv => new GoldPoolDto
                {
                    Weight = kv.Value.Weight,
                    Cost = kv.Value.Cost,
                    TotalInvested = kv.Value.TotalInvested,
                });

            return GenericResponse<Dictionary<int, GoldPoolDto>>.Success(result);
        }
    }
}
