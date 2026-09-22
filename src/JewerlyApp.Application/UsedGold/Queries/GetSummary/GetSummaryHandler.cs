using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Security;
using JewerlyApp.Domain.Enums;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.UsedGold.Queries.GetSummary
{
    public class GetSummaryHandler : IRequestHandler<GetSummaryQuery, GenericResponse<UsedGoldSummaryDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetSummaryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<UsedGoldSummaryDto>> Handle(GetSummaryQuery request, CancellationToken cancellationToken)
        {
            var currentPin = await SalesPinResolver.GetCurrentPinAsync(_context, cancellationToken);

            if (request.Pin?.Trim() != currentPin)
                return GenericResponse<UsedGoldSummaryDto>.Error(ResponseStatusCode.BadRequest, Messages.Error_Security_Pin_Incorrect);

            var pools = await UsedGoldPoolCalculator.GetPoolsAsync(_context, cancellationToken);
            var goldWeight = pools.Sum(p => p.Value.Weight);
            var goldValue = pools.Sum(p => p.Value.Cost);
            var goldAverageKarat = goldWeight > 0
                ? pools.Sum(p => p.Key * p.Value.Weight) / goldWeight
                : 0;

            var dto = new UsedGoldSummaryDto
            {
                UsedGoldWeight = goldWeight,
                UsedGoldAverageKarat = goldAverageKarat,
                UsedGoldValue = goldValue,
            };

            return GenericResponse<UsedGoldSummaryDto>.Success(dto);
        }
    }
}
