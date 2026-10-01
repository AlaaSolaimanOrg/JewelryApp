using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
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
            var repair = await _context.Repairs
                .Include(x => x.Customer)
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

            if (request.Status == RepairStatus.PickedUp)
            {
                repair.PickedUpDate = BusinessTimeZoneHelper.GetEdmontonDate();
                repair.SlotNumber = null;

                if (!string.IsNullOrWhiteSpace(request.PayMethod))
                {
                    repair.PayMethod = request.PayMethod.Trim();
                    repair.PaymentStatus = PaymentStatus.Paid;
                    repair.PaidDate = BusinessTimeZoneHelper.GetEdmontonDate();

                    if (request.CashAmount > 0)
                    {
                        _context.CashTransactions.Add(new CashTransaction
                        {
                            Id = Guid.NewGuid(),
                            BoxType = CashBoxType.Store,
                            Type = CashTransactionType.RepairCashIn,
                            Amount = request.CashAmount,
                            RepairId = repair.Id,
                            Notes = $"Repair #{repair.RepairCode}",
                        });
                    }
                }
            }
            else
            {
                repair.PickedUpDate = null;
            }

            if (request.Status == RepairStatus.Cancelled)
            {
                repair.CancelledDate = BusinessTimeZoneHelper.GetEdmontonDate();
                repair.SlotNumber = null;
            }
            else
            {
                repair.CancelledDate = null;
            }

            if (request.SendSMS && !string.IsNullOrEmpty(repair.Customer.PhoneNumber) && repair.Status == RepairStatus.Completed)
            {
                var message =
                 "Adi Jewelry\n" +
                 "Your repair is ready for pickup.";

                await _smsService.SendAsync(
                    repair.Customer.PhoneNumber,
                    message
                );

                repair.Notified = true;
                repair.NotifiedDate = BusinessTimeZoneHelper.GetEdmontonDate();
            }
            else if (request.MarkNotified && repair.Status == RepairStatus.Completed)
            {
                repair.Notified = true;
                repair.NotifiedDate = BusinessTimeZoneHelper.GetEdmontonDate();
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
