using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Sales.Commands.CreateSale
{
    public class CreateSaleHandler : IRequestHandler<CreateSaleCommand, GenericResponse<string>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserService _userService;

        public CreateSaleHandler(IApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<GenericResponse<string>> Handle(CreateSaleCommand request, CancellationToken cancellationToken)
        {
            var loggedInUser = await _userService.GetLoggedInUser();
            try
            {
                if (!request.SaleItems.Any())
                {
                    return new GenericResponse<string>
                    {
                        Data = null,
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_Sale_MustContain_Items
                    };
                }
                // 🔹 Validate customer
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Id == request.CustomerId, cancellationToken);

                if (customer == null)
                {
                    return new GenericResponse<string>
                    {
                        Data = null,
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_Customer_Not_Found 
                    };
                }

                // 🔹 Create Sale
                var sale = new Sale
                {
                    Id = Guid.NewGuid(),
                    CustomerId = request.CustomerId,
                    Discount = request.Discount,
                    DiscountPercentage = request.DiscountPercentage,
                    DiscountType = request.DiscountType,
                    Note = request.Note,
                    CashAmount = request.CashAmount,
                    CardAmount = request.CardAmount,
                    CreatedDate = DateTime.UtcNow
                };

                decimal subTotal = 0;

                // 🔹 Process each sale item
                foreach (var item in request.SaleItems)
                {
                    Guid? productId = item.ProductId;

                    if (item.IsManualProduct)
                        productId = await AddManualProduct(item, cancellationToken);

                    var product = await _context.Products
                        .FirstOrDefaultAsync(p => p.Id == productId, cancellationToken);

                    if (product == null)
                        continue;

                    // ✅ Calculate subtotal = product final total price × quantity bought
                    var itemTotal = product.Weight * (item.OverriddenPricePerGram ?? item.OriginalPricePerGram);
                    itemTotal = itemTotal;

                    // ✅ Decrease quantity properly
                    if (product.Quantity.HasValue && product.Quantity > 0)
                    {
                        int quantityToReduce = item.Quantity > 0 ? item.Quantity : 1;
                        product.Quantity -= quantityToReduce;
                    }

                    // ✅ Decrease stock weight proportionally
                    //product.Weight = Math.Max(0, product.Weight - item.Weight);
                    product.LastUpdatedDate = DateTime.UtcNow;

                    // Add sale item
                    var saleItem = new SaleItem
                    {
                        Id = Guid.NewGuid(),
                        SaleId = sale.Id,
                        ProductId = product.Id,
                        KaratType = item.KaratType,
                        Weight = item.Weight,
                        OriginalPricePerGram = item.OriginalPricePerGram,
                        OverriddenPricePerGram = item.OverriddenPricePerGram,
                        Quantity = item.Quantity,
                        SubTotal = itemTotal * item.Quantity
                    };

                    subTotal += itemTotal * item.Quantity;
                    sale.SaleItems.Add(saleItem);
                }

                // ✅ Calculate total sale
                sale.SubTotal = subTotal;
                sale.Total = CalculateFinalTotal(sale);

                if (!ValidatePaymentAmounts(sale))
                {
                    return new GenericResponse<string>
                    {
                        Data = null,
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = "Payment amounts do not match total"
                    };
                }

                await _context.Sales.AddAsync(sale, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);

                return new GenericResponse<string>
                {
                    Data = sale.Id.ToString(),
                    StatusCode = ResponseStatusCode.Created,
                    Message = Messages.Success
                };
            }
            catch (Exception ex)
            {
                await Logger.LogErrorAsync(
                    context: _context,
                    handlerName: nameof(CreateSaleHandler),
                    message: "Failed to create sale",
                    exception: ex,
                    content: new
                    {
                        Request = request                        
                    },
                    userId: loggedInUser.Id,
                    cancellationToken
                );
                return new GenericResponse<string>
                {
                    Data = null,
                    StatusCode = ResponseStatusCode.InternalServerError,
                    Message = ex.Message
                };
            }
        }

      

        private decimal CalculateFinalTotal(Sale sale)
        {
            decimal total = sale.SubTotal;

            if (sale.DiscountType == DiscountType.FixedAmount && sale.Discount.HasValue)
                total -= sale.Discount.Value;
            else if (sale.DiscountType == DiscountType.Percentage && sale.DiscountPercentage.HasValue)
                total -= sale.SubTotal * (sale.DiscountPercentage.Value / 100);


            return Math.Max(0, total);
        }

        private bool ValidatePaymentAmounts(Sale sale)
        {
            var totalPaid = (sale.CashAmount ?? 0) + (sale.CardAmount ?? 0);
            return totalPaid >= sale.Total;
        }

        private async Task<Guid> AddManualProduct(SaleItemDto item, CancellationToken cancellationToken)
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = item.ProductName,
                KaratType = item.KaratType,
                Weight = item.Weight,
                Type = ProductType.Gold,
                Quantity = item.Quantity > 0 ? item.Quantity : 1,
                IsManualEntry = true
            };

            await _context.Products.AddAsync(product, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return product.Id;
        }
    }
}
