using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.Extensions.Options;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs.Queries.GetNextAvailableSlot
{
    public class GetNextAvailableSlotHandler : IRequestHandler<GetNextAvailableSlotQuery, GenericResponse<int?>>
    {
        private readonly IApplicationDbContext _context;
        private readonly RepairSettings _repairSettings;

        public GetNextAvailableSlotHandler(IApplicationDbContext context, IOptions<RepairSettings> repairSettings)
        {
            _context = context;
            _repairSettings = repairSettings.Value;
        }

        public async Task<GenericResponse<int?>> Handle(GetNextAvailableSlotQuery request, CancellationToken cancellationToken)
        {
            var slot = await RepairSlotHelper.GetNextAvailableSlotAsync(_context, _repairSettings.MaxSlots, cancellationToken);

            return new GenericResponse<int?>
            {
                Data = slot,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
