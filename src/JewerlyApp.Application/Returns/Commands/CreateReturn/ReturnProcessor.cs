using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Returns.Commands.CreateReturn
{
    internal static class ReturnProcessor
    {
        public static async Task<(GenericResponse<string>? Error, Sale? Sale)> ValidateAsync(
            IApplicationDbContext context,
            Guid saleId,
            List<ReturnItemDto>? items,
            CancellationToken cancellationToken)
        {
            if (items == null || !items.Any())
                return (GenericResponse<string>.Error(
                    ResponseStatusCode.BadRequest,
                    Messages.Error_Return_No_Items), null);

            var sale = await context.Sales
                .Include(s => s.SaleItems)
                .FirstOrDefaultAsync(s => s.Id == saleId, cancellationToken);

            if (sale == null)
                return (GenericResponse<string>.Error(
                    ResponseStatusCode.NotFound,
                    Messages.Error_Sale_Not_Found), null);

            var saleItemsMap = sale.SaleItems.ToDictionary(x => x.Id);

            var saleItemIds = items.Select(i => i.SaleItemId).ToList();
            var existingReturns = await context.ReturnItems
                .Where(ri => saleItemIds.Contains(ri.SaleItemId))
                .GroupBy(ri => ri.SaleItemId)
                .Select(g => new
                {
                    SaleItemId = g.Key,
                    TotalReturnedQuantity = g.Sum(ri => ri.QuantityReturned)
                })
                .ToDictionaryAsync(x => x.SaleItemId, x => x.TotalReturnedQuantity, cancellationToken);

            foreach (var item in items)
            {
                if (!saleItemsMap.TryGetValue(item.SaleItemId, out var saleItem))
                {
                    return (GenericResponse<string>.Error(
                        ResponseStatusCode.BadRequest,
                        Messages.Error_Invalid_SaleItemId(item.SaleItemId)), null);
                }

                if (item.QuantityToReturn <= 0)
                {
                    return (GenericResponse<string>.Error(
                        ResponseStatusCode.BadRequest,
                        Messages.Error_Invalid_Return_Quantity), null);
                }

                var previouslyReturned = existingReturns.GetValueOrDefault(item.SaleItemId, 0);

                if (saleItem.Quantity == 0)
                {
                    return (GenericResponse<string>.Error(
                        ResponseStatusCode.BadRequest,
                        Messages.Error_Item_Already_Returned(saleItem.Quantity, previouslyReturned)), null);
                }

                if (item.QuantityToReturn > saleItem.Quantity)
                {
                    var availableToReturn = saleItem.Quantity - previouslyReturned;
                    return (GenericResponse<string>.Error(
                        ResponseStatusCode.BadRequest,
                        Messages.Error_Return_Exceeds_Available(
                            item.QuantityToReturn, availableToReturn, previouslyReturned)), null);
                }

                if (item.ReturnAmount <= 0)
                {
                    return (GenericResponse<string>.Error(
                        ResponseStatusCode.BadRequest,
                        Messages.Error_Invalid_Return_Amount), null);
                }
            }

            return (null, sale);
        }

        public static async Task<Return> CreateAsync(
            IApplicationDbContext context,
            Sale sale,
            List<ReturnItemDto> items,
            RefundMethod refundMethod,
            int? createdBy,
            Guid? exchangeSaleId,
            CancellationToken cancellationToken)
        {
            var saleItemsMap = sale.SaleItems.ToDictionary(x => x.Id);

            var ret = new Return
            {
                Id = Guid.NewGuid(),
                SerialNumber = await GenerateReturnSerialNumber(context),
                SaleId = sale.Id,
                ExchangeSaleId = exchangeSaleId,
                CreatedBy = createdBy,
                Items = new List<ReturnItem>()
            };

            decimal totalRefund = 0;
            decimal oldSaleSubtotal = sale.SubTotal;
            decimal oldDiscount = sale.Discount ?? 0;

            foreach (var itemDto in items)
            {
                var saleItem = saleItemsMap[itemDto.SaleItemId];

                var returnItem = new ReturnItem
                {
                    Id = Guid.NewGuid(),
                    ReturnId = ret.Id,
                    SaleItemId = saleItem.Id,
                    QuantityPurchased = saleItem.Quantity,
                    QuantityReturned = itemDto.QuantityToReturn,
                    ReturnAmount = itemDto.ReturnAmount,
                    UnitPrice = saleItem.SubTotal / saleItem.Quantity,
                    Reason = itemDto.Reason,
                    ReasonNote = itemDto.ReasonNote,
                    Condition = itemDto.Condition,
                    Option = itemDto.Option
                };

                var ratio = (saleItem.Quantity - itemDto.QuantityToReturn) / (decimal)saleItem.Quantity;
                saleItem.SubTotal *= ratio;
                saleItem.Quantity -= itemDto.QuantityToReturn;

                ret.Items.Add(returnItem);
                totalRefund += itemDto.ReturnAmount;

                await ApplyInventoryAdjustmentAsync(context, saleItem.ProductId, itemDto, cancellationToken);
            }

            ret.TotalAmount = totalRefund;

            sale.SubTotal = sale.SaleItems.Sum(i => i.SubTotal);
            sale.Total -= totalRefund;

            sale.Discount = oldDiscount * (sale.SubTotal / oldSaleSubtotal);
            sale.DiscountPercentage = sale.Total == 0 ? 0 : sale.Discount / sale.Total * 100;

            if (refundMethod == RefundMethod.Cash)
            {
                sale.CashAmount = (sale.CashAmount ?? 0) - totalRefund;

                context.CashTransactions.Add(new CashTransaction
                {
                    Id = Guid.NewGuid(),
                    BoxType = CashBoxType.Store,
                    Type = CashTransactionType.ReturnCashOut,
                    Amount = totalRefund,
                    SaleId = sale.Id,
                    Notes = $"Return {ret.SerialNumber} for sale #{sale.SerialNumber}",
                });
            }
            else if (refundMethod == RefundMethod.Card)
                sale.CardAmount = (sale.CardAmount ?? 0) - totalRefund;

            context.Returns.Add(ret);

            return ret;
        }

        private static async Task ApplyInventoryAdjustmentAsync(
            IApplicationDbContext context,
            Guid productId,
            ReturnItemDto itemDto,
            CancellationToken cancellationToken)
        {
            var product = await context.Products.FirstOrDefaultAsync(p => p.Id == productId, cancellationToken);
            if (product == null)
                return;

            if (itemDto.Option == ReturnOption.ReturnToStock)
            {
                product.Quantity = (product.Quantity ?? 0) + itemDto.QuantityToReturn;
            }
            else if (itemDto.Option == ReturnOption.MeltAfterReturn)
            {
                context.MeltRecords.Add(new MeltRecord
                {
                    Id = Guid.NewGuid(),
                    ProductId = product.Id,
                    Sku = product.Sku,
                    ProductName = product.Name,
                    Quantity = itemDto.QuantityToReturn,
                    Weight = product.Weight,
                    KaratType = (int)product.KaratType,
                    MeltedAt = DateTime.UtcNow
                });
            }

            product.LastUpdatedDate = DateTime.UtcNow;
        }

        private static async Task<string> GenerateReturnSerialNumber(IApplicationDbContext context)
        {
            string today = BusinessTimeZoneHelper.GetEdmontonDate().ToString("yyyyMMdd");
            string prefix = "RTN";

            int countToday = await context.Returns
                .CountAsync(x => x.SerialNumber.StartsWith($"{prefix}-{today}"));

            return $"{prefix}-{today}-{(countToday + 1).ToString("D4")}";
        }
    }
}
