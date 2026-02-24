using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs.Commands.UpdateRepairStatus
{
    public class UpdateRepairStatusHandler : IRequestHandler<UpdateRepairStatusCommand, GenericResponse<Unit>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ISmsService _smsService;

        public UpdateRepairStatusHandler(IApplicationDbContext context, ISmsService smsService)
        {
            _context = context;
            _smsService = smsService;
        }

        public async Task<GenericResponse<Unit>> Handle(UpdateRepairStatusCommand request, CancellationToken cancellationToken)
        {
            var repair = await _context.Repairs.Include(x => x.Items)
                .Include(x=>x.Customer)
                .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

            if (repair == null)
            {
                return new GenericResponse<Unit>
                {
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.Error_Repair_Not_Found
                };
            }


            repair.Status = request.Status;
            
            if (!string.IsNullOrEmpty(repair.Customer.PhoneNumber)  && repair.Status == RepairStatus.Completed)
            {
                var message =
                 "Adi Jewelry\n" +
                 "Your repair is ready for pickup.";

                await _smsService.SendAsync(
                    repair.Customer.PhoneNumber,
                    message
                );
            }

            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<Unit>
            {
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success_Repair_Status_Updated,
                Data = Unit.Value
            };
        }
    }
}
