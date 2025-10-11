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
                // Validate customer exists
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Id == request.CustomerId, cancellationToken);

                if (customer == null)
                    return new GenericResponse<string>
                    {
                        Data = null,
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = "Customer not found"
                    };

                var notManualItems = request.SaleItems.Where(i => !i.IsManualProduct).Select(i => new { i.ProductId, i.ProductName }).ToList();

                var notManualItemIds = notManualItems.Select(i => i.ProductId).ToList();

                var existingProductIds = await _context.Products
                    .Where(x => notManualItemIds.Contains(x.Id))
                    .Select(x => x.Id)
                    .ToListAsync();

                var invalidProducts = notManualItems
                    .Where(item => !existingProductIds.Contains((Guid)item.ProductId!))
                    .Select(item => item.ProductName) // Return the names of invalid products
                    .ToList();

                if (invalidProducts.Any())
                {
                    return new GenericResponse<string>
                    {
                        Data = string.Join(", ", invalidProducts),
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = "Sale contains invalid products",
                    };
                }

                // Create sale entity
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
                    Taxe = request.Taxe
                };

                // Process sale items and calculate totals
                decimal subTotal = 0;
                var productIds = new List<Guid>();

                foreach (var item in request.SaleItems)
                {
                    var productId = item.ProductId;
                    if (item.IsManualProduct)
                    {
                        productId = await AddManualProduct(item, cancellationToken);
                    }
                    productIds.Add((Guid)productId!);

                    // Use overridden price or get current price from product
                    var pricePerGram = item.OverriddenPricePerGram ?? item.OriginalPricePerGram;

                    var itemSubTotal = Math.Round(item.Weight * pricePerGram, 2, MidpointRounding.AwayFromZero);

                    var saleItem = new SaleItem
                    {
                        Id = Guid.NewGuid(),
                        SaleId = sale.Id,
                        ProductId = (Guid)productId!,
                        KaratType = item.KaratType,
                        Weight = item.Weight,
                        OriginalPricePerGram = item.OriginalPricePerGram,
                        OverriddenPricePerGram = item.OverriddenPricePerGram,
                        SubTotal = itemSubTotal
                    };

                    subTotal += itemSubTotal;
                    sale.SaleItems.Add(saleItem);
                }

                // Calculate final totals
                sale.SubTotal = subTotal;
                sale.Total = CalculateFinalTotal(sale);

                // Validate payment amounts
                if (!ValidatePaymentAmounts(sale))
                    return new GenericResponse<string>
                    {
                        Data = null,
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = "Payment amounts do not match total"
                    };

                // Save to database
                await _context.Sales.AddAsync(sale, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);

                // decrease from product quatities 1
                await _context.Products
                .Where(p => productIds.Contains(p.Id) && p.Quantity > 0)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(p => p.Quantity, p => p.Quantity - 1)
                    .SetProperty(p => p.LastUpdatedDate, DateTime.UtcNow)
                );

                return new GenericResponse<string>
                {
                    Data = null,
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
                    Message = ex.Message,
                };
            }
        }


        private decimal CalculateFinalTotal(Sale sale)
        {
            // Round subtotal first
            decimal total = Math.Round(sale.SubTotal, 2, MidpointRounding.AwayFromZero);

            // Apply discount
            if (sale.DiscountType == DiscountType.FixedAmount && sale.Discount.HasValue)
            {
                var discount = Math.Round(sale.Discount.Value, 2, MidpointRounding.AwayFromZero);
                total -= discount;
            }
            else if (sale.DiscountType == DiscountType.Percentage && sale.DiscountPercentage.HasValue)
            {
                var discountAmount = Math.Round(sale.SubTotal * (sale.DiscountPercentage.Value / 100), 2, MidpointRounding.AwayFromZero);
                total -= discountAmount;
            }

            // Add tax (already rounded)
            total += Math.Round(sale.Taxe, 2, MidpointRounding.AwayFromZero);

            // Final round
            total = Math.Round(total, 2, MidpointRounding.AwayFromZero);

            return Math.Max(0, total);
        }

        private bool ValidatePaymentAmounts(Sale sale)
        {
            var totalPaid = (sale.CashAmount ?? 0) + (sale.CardAmount ?? 0);
            return totalPaid >= sale.Total; // Allow overpayment
        }

        private async Task<Guid> AddManualProduct(SaleItemDto item, CancellationToken cancellationToken)
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = item.ProductName,
                KaratType = item.KaratType,
                Sku = null,
                Weight = item.Weight,
                Category = null,
                Type = ProductType.Gold,
                Description = null,
                Quantity = 1,
                IsManualEntry = true,
            };

            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync(cancellationToken);

            return product.Id;
        }

    }
}
