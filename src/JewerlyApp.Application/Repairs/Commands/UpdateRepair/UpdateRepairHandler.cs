using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Repairs.Commands.UpdateRepair;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs.Commands.UpdateRepair
{
    public class UpdateRepairHandler : IRequestHandler<UpdateRepairCommand, GenericResponse<Unit>>
    {
        private readonly IApplicationDbContext _context;

        public UpdateRepairHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<Unit>> Handle(UpdateRepairCommand request, CancellationToken cancellationToken)
        {
            var repair = await _context.Repairs
                .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

            if (repair == null)
            {
                return new GenericResponse<Unit>
                {
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.Error_Repair_Not_Found
                };
            }

            if (request.Notes.Length > 1000)
            {
                return new GenericResponse<Unit>
                {
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = Messages.Error_Repair_Notes_Too_Long
                };
            }

            if (request.DueDate.HasValue && request.DueDate.Value < BusinessTimeZoneHelper.GetEdmontonDate())
            {
                return new GenericResponse<Unit>
                {
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = Messages.Error_Repair_DueDate_In_Past
                };
            }

            repair.Cost = request.Cost;
            repair.Notes = request.Notes;
            repair.DueDate = request.DueDate;

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

