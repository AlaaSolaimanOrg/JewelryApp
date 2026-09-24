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

            var wasPaid = repair.PaymentStatus == PaymentStatus.Paid;
            repair.PaymentStatus = request.NewPaymentStatus;

            if (request.NewPaymentStatus == PaymentStatus.Paid)
            {
                if (!string.IsNullOrWhiteSpace(request.PayMethod))
                {
                    repair.PayMethod = request.PayMethod.Trim();
                }
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
            else
            {
                repair.PayMethod = null;
                repair.PaidDate = null;

                // Undoing a payment that had a cash component takes that cash back out of the box.
                if (wasPaid)
                {
                    var priorCashIn = await _context.CashTransactions
                        .Where(t => t.RepairId == repair.Id && t.Type == CashTransactionType.RepairCashIn)
                        .SumAsync(t => t.Amount, cancellationToken);

                    var priorCashOut = await _context.CashTransactions
                        .Where(t => t.RepairId == repair.Id && t.Type == CashTransactionType.RepairCashOut)
                        .SumAsync(t => t.Amount, cancellationToken);

                    var netCashIn = priorCashIn - priorCashOut;

                    if (netCashIn > 0)
                    {
                        _context.CashTransactions.Add(new CashTransaction
                        {
                            Id = Guid.NewGuid(),
                            BoxType = CashBoxType.Store,
                            Type = CashTransactionType.RepairCashOut,
                            Amount = netCashIn,
                            RepairId = repair.Id,
                            Notes = $"Repair #{repair.RepairCode} — payment reversed",
                        });
                    }
                }
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
