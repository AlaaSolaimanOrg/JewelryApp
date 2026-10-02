using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.CashManagement.Commands.CorrectSalePayment
{
    public class CorrectSalePaymentHandler : IRequestHandler<CorrectSalePaymentCommand, GenericResponse<Guid>>
    {
        private const decimal Tolerance = 0.01m;

        private readonly IApplicationDbContext _context;

        public CorrectSalePaymentHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<Guid>> Handle(CorrectSalePaymentCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Reason))
                return GenericResponse<Guid>.Error(ResponseStatusCode.BadRequest, Messages.Error_Cash_ReasonRequired);

            if (request.CashAmount < 0 || request.CardAmount < 0)
                return GenericResponse<Guid>.Error(ResponseStatusCode.BadRequest, Messages.Error_Cash_InvalidAmount);

            var sale = await _context.Sales
                .FirstOrDefaultAsync(s => s.Id == request.SaleId, cancellationToken);

            if (sale == null)
                return GenericResponse<Guid>.Error(ResponseStatusCode.NotFound, Messages.Error_Sale_Not_Found);

            if (Math.Abs(request.CashAmount + request.CardAmount - sale.Total) > Tolerance)
                return GenericResponse<Guid>.Error(ResponseStatusCode.BadRequest, Messages.Error_Cash_SalePayment_Mismatch);

            var oldCash = sale.CashAmount ?? 0;
            var oldCard = sale.CardAmount ?? 0;
            var cashDiff = request.CashAmount - oldCash;

            if (Math.Abs(cashDiff) < Tolerance)
                return GenericResponse<Guid>.Error(ResponseStatusCode.BadRequest, Messages.Error_Cash_SalePayment_Unchanged);

            if (cashDiff < 0)
            {
                var storeBalance = await CashBalanceCalculator.GetBalanceAsync(_context, CashBoxType.Store, cancellationToken);
                if (-cashDiff > storeBalance)
                    return GenericResponse<Guid>.Error(ResponseStatusCode.BadRequest, Messages.Error_Cash_InsufficientBalance);
            }

            sale.CashAmount = request.CashAmount;
            sale.CardAmount = request.CardAmount;
            sale.LastUpdatedDate = DateTime.UtcNow;

            var transaction = new CashTransaction
            {
                Id = Guid.NewGuid(),
                BoxType = CashBoxType.Store,
                Type = cashDiff > 0
                    ? CashTransactionType.SalePaymentCorrectionIn
                    : CashTransactionType.SalePaymentCorrectionOut,
                Amount = Math.Abs(cashDiff),
                SaleId = sale.Id,
                Category = "Sale payment correction",
                Notes = $"Cash {oldCash:0.00} → {request.CashAmount:0.00}, Card {oldCard:0.00} → {request.CardAmount:0.00}. Reason: {request.Reason.Trim()}",
            };

            _context.CashTransactions.Add(transaction);
            await _context.SaveChangesAsync(cancellationToken);

            return GenericResponse<Guid>.Created(transaction.Id, Messages.Success_Cash_SalePayment_Corrected);
        }
    }
}
