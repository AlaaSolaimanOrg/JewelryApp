using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.CashManagement.Commands.TransferIncome
{
    public class TransferIncomeHandler : IRequestHandler<TransferIncomeCommand, GenericResponse<Guid>>
    {
        private readonly IApplicationDbContext _context;

        public TransferIncomeHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<Guid>> Handle(TransferIncomeCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.CustomerName))
                return GenericResponse<Guid>.Error(ResponseStatusCode.BadRequest, Messages.Error_Cash_CustomerNameRequired);

            if (request.Amount <= 0)
                return GenericResponse<Guid>.Error(ResponseStatusCode.BadRequest, Messages.Error_Cash_InvalidAmount);

            var transaction = new CashTransaction
            {
                Id = Guid.NewGuid(),
                BoxType = CashBoxType.Transfers,
                Type = CashTransactionType.TransferIncome,
                Amount = request.Amount,
                CustomerName = request.CustomerName.Trim(),
                Destination = string.IsNullOrWhiteSpace(request.Destination) ? null : request.Destination.Trim(),
                Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            };

            _context.CashTransactions.Add(transaction);
            await _context.SaveChangesAsync(cancellationToken);

            return GenericResponse<Guid>.Created(transaction.Id, Messages.Success_Cash_TransferIncome_Added);
        }
    }
}
