using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.CashManagement.Commands.MoveMoney
{
    public class MoveMoneyHandler : IRequestHandler<MoveMoneyCommand, GenericResponse<Guid>>
    {
        private readonly IApplicationDbContext _context;

        public MoveMoneyHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<Guid>> Handle(MoveMoneyCommand request, CancellationToken cancellationToken)
        {
            if (request.Amount <= 0)
                return GenericResponse<Guid>.Error(ResponseStatusCode.BadRequest, Messages.Error_Cash_InvalidAmount);

            var toBox = request.FromBox == CashBoxType.Store ? CashBoxType.Transfers : CashBoxType.Store;

            var fromBalance = await CashBalanceCalculator.GetBalanceAsync(_context, request.FromBox, cancellationToken);
            if (request.Amount > fromBalance)
                return GenericResponse<Guid>.Error(ResponseStatusCode.BadRequest, Messages.Error_Cash_InsufficientBalance);

            var reason = string.IsNullOrWhiteSpace(request.Reason) ? null : request.Reason.Trim();
            var transferGroupId = Guid.NewGuid();

            var outTransaction = new CashTransaction
            {
                Id = Guid.NewGuid(),
                BoxType = request.FromBox,
                Type = CashTransactionType.MoveMoneyOut,
                Amount = request.Amount,
                Notes = reason,
                TransferGroupId = transferGroupId,
            };

            var inTransaction = new CashTransaction
            {
                Id = Guid.NewGuid(),
                BoxType = toBox,
                Type = CashTransactionType.MoveMoneyIn,
                Amount = request.Amount,
                Notes = reason,
                TransferGroupId = transferGroupId,
            };

            _context.CashTransactions.Add(outTransaction);
            _context.CashTransactions.Add(inTransaction);
            await _context.SaveChangesAsync(cancellationToken);

            return GenericResponse<Guid>.Created(outTransaction.Id, Messages.Success_Cash_MoneyMoved);
        }
    }
}
