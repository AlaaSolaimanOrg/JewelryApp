using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs.Commands.UpdateRepairPaymentStatus
{
    public class UpdateRepairPaymentStatusHandler : IRequestHandler<UpdateRepairPaymentStatusCommand, GenericResponse<Unit>>
    {
        private readonly IApplicationDbContext _context;

        public UpdateRepairPaymentStatusHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<Unit>> Handle(UpdateRepairPaymentStatusCommand request, CancellationToken cancellationToken)
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

            repair.PaymentStatus = request.NewPaymentStatus;

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
