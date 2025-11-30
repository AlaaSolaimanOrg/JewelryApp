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

            // -------------------------------
            // 1. VALIDATE REQUEST
            // -------------------------------
            var validationError = await ValidateRequestAsync(request, cancellationToken);
            if (validationError != null)
                return validationError;

            // -------------------------------
            // 2. INSERT MANUAL PRODUCTS FIRST
            // -------------------------------
            await AddManualProductsBatch(request.SaleItems, cancellationToken);

            // Now ALL sale items have a valid ProductId
            var allProductIds = request.SaleItems
                .Select(i => i.ProductId!.Value)
                .ToList();

            // -------------------------------
            // 3. FETCH ALL PRODUCTS IN ONE CALL
            // -------------------------------
            var products = await _context.Products
                .Where(p => allProductIds.Contains(p.Id))
                .ToDictionaryAsync(p => p.Id, cancellationToken);

            // -------------------------------
            // 4. PREPARE SALE
            // -------------------------------
            var sale = new Sale
            {
                Id = Guid.NewGuid(),
                SerialNumber = await GenerateSaleSerialNumber(),
                CustomerId = request.CustomerId,
                Discount = request.Discount,
                DiscountPercentage = request.DiscountPercentage,
                DiscountType = request.DiscountType,
                Note = request.Note,
                CashAmount = request.CashAmount,
                CardAmount = request.CardAmount,
                CreatedDate = DateTime.UtcNow,
                SaleItems = new List<SaleItem>()
            };

            decimal subTotal = 0;

            // -------------------------------
            // 5. PROCESS SALE ITEMS
            // -------------------------------
            foreach (var item in request.SaleItems)
            {
                var productId = item.ProductId!.Value;

                if (!products.TryGetValue(productId, out var product))
                    return new GenericResponse<string>
                    {
                        Data = null,
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Errror_Product_Not_Found(item.ProductName),
                    };

                var saleItem = CreateSaleItem(sale.Id, product, item);
                UpdateProductStock(product, item);

                subTotal += saleItem.SubTotal;
                sale.SaleItems.Add(saleItem);
            }

            // -------------------------------
            // 6. CALCULATE TOTALS
            // -------------------------------
            sale.SubTotal = subTotal;
            sale.Total = CalculateFinalTotal(sale);

            if (!ValidatePaymentAmounts(sale))
            {
                return new GenericResponse<string>
                {
                    Data = null,
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = Messages.Error_Payments_Dont_Match,
                };
            }

            // -------------------------------
            // 7. SAVE SALE
            // -------------------------------
            _context.Sales.Add(sale);
            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<string>
            {
                Data = sale.Id.ToString(),
                StatusCode = ResponseStatusCode.Created,
                Message = Messages.Success
            };
        }



        private async Task<GenericResponse<string>?> ValidateRequestAsync(CreateSaleCommand request, CancellationToken cancellationToken)
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

            var customerExists = await _context.Customers
                .AnyAsync(c => c.Id == request.CustomerId, cancellationToken);

            if (!customerExists)
            {
                return new GenericResponse<string>
                {
                    Data = null,
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = Messages.Error_Customer_Not_Found
                };
            }

            return null;
        }


        private async Task AddManualProductsBatch(List<SaleItemDto> items, CancellationToken cancellationToken)
        {
            var newProducts = new List<Product>();

            foreach (var item in items.Where(i => i.IsManualProduct))
            {
                var newProductId = Guid.NewGuid();
                item.ProductId = newProductId;

                newProducts.Add(new Product
                {
                    Id = newProductId,
                    Name = item.ProductName,
                    KaratType = item.KaratType,
                    Weight = item.Weight,
                    Type = ProductType.Gold,
                    Quantity = item.Quantity > 0 ? item.Quantity : 1,
                    IsManualEntry = true,
                    CreatedDate = DateTime.UtcNow
                });
            }

            if (newProducts.Any())
            {
                await _context.Products.AddRangeAsync(newProducts, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);
            }
        }



        private SaleItem CreateSaleItem(Guid saleId, Product product, SaleItemDto item)
        {
            decimal pricePerGram = item.OverriddenPricePerGram ?? item.OriginalPricePerGram;
            decimal itemPrice = product.Weight * pricePerGram;
            decimal lineTotal = itemPrice * item.Quantity;

            return new SaleItem
            {
                Id = Guid.NewGuid(),
                SaleId = saleId,
                ProductId = product.Id,
                KaratType = item.KaratType,
                Weight = item.Weight,
                OriginalPricePerGram = item.OriginalPricePerGram,
                OverriddenPricePerGram = item.OverriddenPricePerGram,
                Quantity = item.Quantity,
                SubTotal = lineTotal
            };
        }


        private void UpdateProductStock(Product product, SaleItemDto item)
        {
            if (product.Quantity.HasValue && product.Quantity > 0)
            {
                int qty = item.Quantity > 0 ? item.Quantity : 1;
                product.Quantity -= qty;
            }

            // Reduce weight if needed (optional)
            // product.Weight = Math.Max(0, product.Weight - item.Weight);

            product.LastUpdatedDate = DateTime.UtcNow;
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

        private async Task<string> GenerateSaleSerialNumber()
        {
            string today = DateTime.UtcNow.ToString("yyyyMMdd");
            string prefix = "SALE";

            int countToday = await _context.Sales
                .CountAsync(x => x.SerialNumber.StartsWith($"{prefix}-{today}"));

            return $"{prefix}-{today}-{(countToday + 1).ToString("D4")}";
        }

    }
}
