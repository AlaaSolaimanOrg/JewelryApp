using JewerlyApp.Application.CashManagement;
using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.UsedGold.Commands.CreatePurchase
{
    public class CreateUsedGoldPurchaseHandler : IRequestHandler<CreateUsedGoldPurchaseCommand, GenericResponse<string>>
    {
        private readonly IApplicationDbContext _context;

        public CreateUsedGoldPurchaseHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<string>> Handle(CreateUsedGoldPurchaseCommand request, CancellationToken cancellationToken)
        {
            //-----------------------------------------------------
            // 1. VALIDATION
            //-----------------------------------------------------
            if (request.Items == null || !request.Items.Any())
                return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_Purchase_No_Items);

            foreach (var item in request.Items)
            {
                if (item.Karat < 1 || item.Karat > 24)
                    return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_Purchase_Invalid_Karat);

                if (item.Weight <= 0)
                    return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_Purchase_Invalid_Weight);

                if (item.PricePerGram <= 0)
                    return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_Purchase_Invalid_Price);
            }

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Id == request.CustomerId, cancellationToken);
            if (customer == null)
                return GenericResponse<string>.Error(ResponseStatusCode.NotFound, Messages.Error_UsedGold_Customer_Not_Found);

            //-----------------------------------------------------
            // 2. BUILD PURCHASE
            //-----------------------------------------------------
            var purchase = new UsedGoldPurchase
            {
                Id = Guid.NewGuid(),
                SerialNumber = await GenerateSerialNumber(),
                CustomerId = customer.Id,
                CustomerName = customer.Name,
                CustomerPhone = customer.PhoneNumber,
                PayMethod = request.PayMethod,
                Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            };

            foreach (var itemDto in request.Items)
            {
                var subtotal = itemDto.Weight * itemDto.PricePerGram;

                purchase.Items.Add(new UsedGoldPurchaseItem
                {
                    Id = Guid.NewGuid(),
                    PurchaseId = purchase.Id,
                    Karat = itemDto.Karat,
                    Weight = itemDto.Weight,
                    PricePerGram = itemDto.PricePerGram,
                    Subtotal = subtotal,
                });
            }

            purchase.TotalWeight = purchase.Items.Sum(i => i.Weight);
            purchase.TotalAmount = purchase.Items.Sum(i => i.Subtotal);

            //-----------------------------------------------------
            // 3. CASH OUT (debit the box the seller was paid from)
            //-----------------------------------------------------
            var boxType = request.PayMethod == UsedGoldPayMethod.Cash
                ? CashBoxType.Store
                : CashBoxType.Transfers;

            var boxBalance = await CashBalanceCalculator.GetBalanceAsync(_context, boxType, cancellationToken);
            if (purchase.TotalAmount > boxBalance)
                return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_Purchase_InsufficientBalance);

            _context.CashTransactions.Add(new CashTransaction
            {
                Id = Guid.NewGuid(),
                BoxType = boxType,
                Type = CashTransactionType.UsedGoldPurchaseOut,
                Amount = purchase.TotalAmount,
                CustomerName = customer.Name,
                UsedGoldPurchaseId = purchase.Id,
                Notes = $"Used gold purchase #{purchase.SerialNumber}",
            });

            //-----------------------------------------------------
            // 4. SAVE
            //-----------------------------------------------------
            _context.UsedGoldPurchases.Add(purchase);
            await _context.SaveChangesAsync(cancellationToken);

            return GenericResponse<string>.Created(purchase.Id.ToString(), Messages.Success_UsedGold_Purchase_Created);
        }

        private async Task<string> GenerateSerialNumber()
        {
            string today = BusinessTimeZoneHelper.GetEdmontonDate().ToString("yyyyMMdd");
            string prefix = "UGP";

            int countToday = await _context.UsedGoldPurchases
                .CountAsync(x => x.SerialNumber.StartsWith($"{prefix}-{today}"));

            return $"{prefix}-{today}-{(countToday + 1).ToString("D4")}";
        }
    }
}
