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

        public CreateSaleHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<string>> Handle(CreateSaleCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // 🔹 Validate customer
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Id == request.CustomerId, cancellationToken);

                if (customer == null)
                {
                    return new GenericResponse<string>
                    {
                        Data = null,
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = "Customer not found"
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
                    Taxe = request.Taxe,
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
                    itemTotal = CustomRound(itemTotal);

                    // ✅ Decrease quantity properly
                    if (product.Quantity.HasValue && product.Quantity > 0)
                    {
                        int quantityToReduce = item.Quantity > 0 ? item.Quantity : 1;
                        product.Quantity -= quantityToReduce;
                    }

                    // ✅ Decrease stock weight proportionally
                    product.Weight = Math.Max(0, product.Weight - item.Weight);
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
                        SubTotal = itemTotal
                    };

                    subTotal += itemTotal;
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
                return new GenericResponse<string>
                {
                    Data = null,
                    StatusCode = ResponseStatusCode.InternalServerError,
                    Message = ex.Message
                };
            }
        }

        // 🧮 Custom rounding rule: if decimal part < .5 → round down, else round up
        private static decimal CustomRound(decimal value)
        {
            var fractional = value - Math.Floor(value);
            return fractional < 0.5m ? Math.Floor(value) : Math.Ceiling(value);
        }

        private decimal CalculateFinalTotal(Sale sale)
        {
            decimal total = sale.SubTotal;

            if (sale.DiscountType == DiscountType.FixedAmount && sale.Discount.HasValue)
                total -= sale.Discount.Value;
            else if (sale.DiscountType == DiscountType.Percentage && sale.DiscountPercentage.HasValue)
                total -= sale.SubTotal * (sale.DiscountPercentage.Value / 100);

            total += sale.Taxe;

            total = CustomRound(total);
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
