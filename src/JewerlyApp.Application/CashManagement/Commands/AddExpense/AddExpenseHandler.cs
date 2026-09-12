using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.CashManagement.Commands.AddExpense
{
    public class AddExpenseHandler : IRequestHandler<AddExpenseCommand, GenericResponse<Guid>>
    {
        private readonly IApplicationDbContext _context;

        public AddExpenseHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<Guid>> Handle(AddExpenseCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Category))
                return GenericResponse<Guid>.Error(ResponseStatusCode.BadRequest, Messages.Error_Cash_CategoryRequired);

            if (request.Amount <= 0)
                return GenericResponse<Guid>.Error(ResponseStatusCode.BadRequest, Messages.Error_Cash_InvalidAmount);

            if (string.IsNullOrWhiteSpace(request.Notes))
                return GenericResponse<Guid>.Error(ResponseStatusCode.BadRequest, Messages.Error_Cash_NotesRequired);

            var storeBalance = await CashBalanceCalculator.GetBalanceAsync(_context, CashBoxType.Store, cancellationToken);
            if (request.Amount > storeBalance)
                return GenericResponse<Guid>.Error(ResponseStatusCode.BadRequest, Messages.Error_Cash_InsufficientBalance);

            var transaction = new CashTransaction
            {
                Id = Guid.NewGuid(),
                BoxType = CashBoxType.Store,
                Type = CashTransactionType.Expense,
                Amount = request.Amount,
                Category = request.Category.Trim(),
                Notes = request.Notes.Trim(),
            };

            _context.CashTransactions.Add(transaction);
            await _context.SaveChangesAsync(cancellationToken);

            return GenericResponse<Guid>.Created(transaction.Id, Messages.Success_Cash_Expense_Added);
        }
    }
}
