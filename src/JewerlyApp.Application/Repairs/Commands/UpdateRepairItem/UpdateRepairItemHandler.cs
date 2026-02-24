using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs.Commands.UpdateRepairItem
{
    public class UpdateRepairItemHandler : IRequestHandler<UpdateRepairItemCommand, GenericResponse<Unit>>
    {
        private readonly IApplicationDbContext _context;

        public UpdateRepairItemHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<Unit>> Handle(UpdateRepairItemCommand request, CancellationToken cancellationToken)
        {
            // Validate and load repair item with parent repair
            var repairItem = await _context.RepairItems
                .Include(ri => ri.Repair)
                    .ThenInclude(r => r.Items)
                .FirstOrDefaultAsync(ri => ri.Id == request.RepairItemId, cancellationToken);

            if (repairItem == null)
            {
                return GenericResponse<Unit>.Error(
                    ResponseStatusCode.NotFound,
                    Messages.Error_RepairItem_Not_Found);
            }

            // Update the repair item fields
            repairItem.Cost = request.Cost;



            // Recalculate the parent repair's TotalCost
            var repair = repairItem.Repair;
            repair.TotalCost = 0;
            foreach (var item in repair.Items)
            {
                repair.TotalCost += item.Cost;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<Unit>
            {
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success_Action,
                Data = Unit.Value
            };
        }
    }
}
