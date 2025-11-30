using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace JewerlyApp.Application.Returns.Commands.CreateReturn
{
    public class CreateReturnHandler : IRequestHandler<CreateReturnCommand, GenericResponse<string>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserService _userService;

        public CreateReturnHandler(IApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<GenericResponse<string>> Handle(CreateReturnCommand request, CancellationToken cancellationToken)
        {
            var loggedInUser = await _userService.GetLoggedInUser();

                //-----------------------------------------------------
                // 1. VALIDATION
                //-----------------------------------------------------
                var validation = await ValidateRequestAsync(request, cancellationToken);
                if (validation != null)
                    return validation;

                //-----------------------------------------------------
                // 2. LOAD SALE & ITEMS
                //-----------------------------------------------------
                var sale = await _context.Sales
                    .Include(s => s.SaleItems)
                    .FirstOrDefaultAsync(s => s.Id == request.SaleId, cancellationToken);

                var saleItemsMap = sale!.SaleItems.ToDictionary(x => x.Id);

                //-----------------------------------------------------
                // 3. PREPARE RETURN HEADER
                //-----------------------------------------------------
                var ret = new Return
                {
                    Id = Guid.NewGuid(),
                    SerialNumber = await GenerateReturnSerialNumber(),
                    SaleId = sale.Id,
                    CreatedBy = loggedInUser.Id,
                    Items = new List<ReturnItem>()
                };

                decimal totalRefund = 0;

                //-----------------------------------------------------
                // 4. PROCESS EACH RETURN ITEM
                //-----------------------------------------------------
                foreach (var itemDto in request.Items)
                {
                    var saleItem = saleItemsMap[itemDto.SaleItemId];

                    var returnItem = new ReturnItem
                    {
                        Id = Guid.NewGuid(),
                        ReturnId = ret.Id,
                        SaleItemId = saleItem.Id,
                        QuantityPurchased = saleItem.Quantity,
                        QuantityReturned = itemDto.QuantityToReturn,

                        // ❗ Provided by frontend
                        ReturnAmount = itemDto.ReturnAmount,
                        UnitPrice = saleItem.SubTotal / saleItem.Quantity,

                        Reason = itemDto.Reason,
                        ReasonNote = itemDto.ReasonNote,
                        Condition = itemDto.Condition,
                        Option = itemDto.Option
                    };

                    ret.Items.Add(returnItem);
                    totalRefund += itemDto.ReturnAmount;

                    //-----------------------------------------------------
                    // 5. INVENTORY UPDATE
                    //-----------------------------------------------------
                    await ApplyInventoryAdjustmentAsync(saleItem.ProductId, itemDto);
                }

                //-----------------------------------------------------
                // 6. SET RETURN TOTAL
                //-----------------------------------------------------
                ret.TotalAmount = totalRefund;

                //-----------------------------------------------------
                // 7. SAVE RETURN
                //-----------------------------------------------------
                _context.Returns.Add(ret);
                await _context.SaveChangesAsync(cancellationToken);

                return GenericResponse<string>.Success(ret.Id.ToString());
        }



        // =================================================================\====
        // VALIDATION — UPDATED TO VALIDATE FRONTEND ReturnAmount
        // =====================================================================
        private async Task<GenericResponse<string>?> ValidateRequestAsync(
    CreateReturnCommand request,
    CancellationToken cancellationToken)
        {
            var errors = new List<string>();

            // 1. Must contain items
            if (request.Items == null || !request.Items.Any())
                return GenericResponse<string>.Error(
                    ResponseStatusCode.BadRequest,
                    Messages.Error_Return_No_Items);

            // 2. Load sale
            var sale = await _context.Sales
                .Include(s => s.SaleItems)
                .FirstOrDefaultAsync(s => s.Id == request.SaleId, cancellationToken);

            if (sale == null)
                return GenericResponse<string>.Error(
                    ResponseStatusCode.NotFound,
                    Messages.Error_Sale_Not_Found);

            var saleItemsMap = sale.SaleItems.ToDictionary(x => x.Id);

            // 3. Validate each return item
            foreach (var item in request.Items)
            {
                // Invalid sale item
                if (!saleItemsMap.TryGetValue(item.SaleItemId, out var saleItem))
                {
                    errors.Add(Messages.Error_Invalid_SaleItemId(item.SaleItemId));
                    continue;
                }

                // Invalid qty
                if (item.QuantityToReturn <= 0)
                {
                    errors.Add(Messages.Error_Invalid_Return_Quantity);
                    continue;
                }

                // Qty exceeds purchased amount
                if (item.QuantityToReturn > saleItem.Quantity)
                {
                    errors.Add(Messages.Error_Return_Quantity_Exceeds(
                        item.QuantityToReturn, saleItem.Quantity));
                }

                // Invalid amount
                if (item.ReturnAmount <= 0)
                {
                    errors.Add(Messages.Error_Invalid_Return_Amount);
                }                             
            }

            if (errors.Any())
                return GenericResponse<string>.ValidationError(errors);

            return null;
        }




        // =====================================================================
        // INVENTORY UPDATE
        // =====================================================================
        private async Task ApplyInventoryAdjustmentAsync(Guid productId, ReturnItemDto itemDto)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);
            if (product == null)
                return;

            if (itemDto.Option == ReturnOption.ReturnToStock)
            {
                product.Quantity = (product.Quantity ?? 0) + itemDto.QuantityToReturn;
            }
            else if (itemDto.Option == ReturnOption.MeltAfterReturn)
            {
                // optional: add weight to raw gold table
            }

            product.LastUpdatedDate = DateTime.UtcNow;
        }



        // =====================================================================
        // SERIAL GENERATOR
        // =====================================================================
        private async Task<string> GenerateReturnSerialNumber()
        {
            string today = DateTime.UtcNow.ToString("yyyyMMdd");
            string prefix = "RTN";

            int countToday = await _context.Returns
                .CountAsync(x => x.SerialNumber.StartsWith($"{prefix}-{today}"));

            return $"{prefix}-{today}-{(countToday + 1).ToString("D4")}";
        }
    }



}
