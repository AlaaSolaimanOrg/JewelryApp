using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.InventorySettings.Queries.GetLowStockThreshold
{
    public class GetLowStockThresholdHandler : IRequestHandler<GetLowStockThresholdQuery, GenericResponse<int>>
    {
        private readonly IApplicationDbContext _context;

        public GetLowStockThresholdHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<int>> Handle(GetLowStockThresholdQuery request, CancellationToken cancellationToken)
        {
            var threshold = await LowStockThresholdResolver.GetCurrentThresholdAsync(_context, cancellationToken);

            return GenericResponse<int>.Success(threshold);
        }
    }
}
