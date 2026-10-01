using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.CashManagement.Commands.ManualCashIn
{
    public class ManualCashInHandler : IRequestHandler<ManualCashInCommand, GenericResponse<Guid>>
    {
        private readonly IApplicationDbContext _context;

        public ManualCashInHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<Guid>> Handle(ManualCashInCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Source))
                return GenericResponse<Guid>.Error(ResponseStatusCode.BadRequest, Messages.Error_Cash_SourceRequired);

            if (request.Amount <= 0)
                return GenericResponse<Guid>.Error(ResponseStatusCode.BadRequest, Messages.Error_Cash_InvalidAmount);

            var transaction = new CashTransaction
            {
                Id = Guid.NewGuid(),
                BoxType = CashBoxType.Store,
                Type = CashTransactionType.ManualCashIn,
                Amount = request.Amount,
                Category = request.Source.Trim(),
                Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            };

            _context.CashTransactions.Add(transaction);
            await _context.SaveChangesAsync(cancellationToken);

            return GenericResponse<Guid>.Created(transaction.Id, Messages.Success_Cash_ManualCashIn_Added);
        }
    }
}
