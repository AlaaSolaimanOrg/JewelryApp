using JewerlyApp.Application.CashManagement;
using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Returns.Commands.CreateReturn;
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
        private readonly ISkuService _skuService;

        public CreateSaleHandler(IApplicationDbContext context, IUserService userService, ISkuService skuService)
        {
            _context = context;
            _userService = userService;
            _skuService = skuService;
        }

        public async Task<GenericResponse<string>> Handle(CreateSaleCommand request, CancellationToken cancellationToken)
        {
            var loggedInUser = await _userService.GetLoggedInUser();

            // -------------------------------
            // 1. VALIDATE REQUEST
            // -------------------------------
            var (validationError, customer) = await ValidateRequestAsync(request, cancellationToken);
            if (validationError != null)
                return validationError;

            var tradeInItems = (request.TradeInItems ?? new())
                .Where(i => i.Weight > 0)
                .ToList();

            foreach (var item in tradeInItems)
            {
                if (item.Karat < 1 || item.Karat > 24)
                    return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_Purchase_Invalid_Karat);

                if (item.Weight <= 0)
                    return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_Purchase_Invalid_Weight);

                if (item.PricePerGram <= 0)
                    return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_Purchase_Invalid_Price);
            }

            Sale? exchangeSourceSale = null;
            decimal exchangeCredit = 0;
            if (request.Exchange != null)
            {
                var (exchangeError, sourceSale) = await ReturnProcessor.ValidateAsync(
                    _context, request.Exchange.SaleId, request.Exchange.Items, cancellationToken);
                if (exchangeError != null)
                    return exchangeError;

                exchangeSourceSale = sourceSale;
                exchangeCredit = request.Exchange.Items.Sum(i => i.ReturnAmount);
            }

            // -------------------------------
            // 2. STAGE NEW / MANUAL PRODUCTS (saved together with the sale)
            // -------------------------------
            var newProducts = await StageNewProductsAsync(request.SaleItems);

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

            foreach (var newProduct in newProducts)
                products[newProduct.Id] = newProduct;

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
            var tradeInCredit = tradeInItems.Sum(i => i.Weight * i.PricePerGram);
            var rawTotal = CalculateFinalTotal(sale) - exchangeCredit - tradeInCredit;
            sale.Total = Math.Max(0, rawTotal);

            // Trade-in/exchange credit exceeded what was bought — the store owes the
            // customer cash back. Make sure the till actually has it before committing.
            var changeDue = rawTotal < 0 ? -rawTotal : 0;
            if (changeDue > 0)
            {
                var storeBalance = await CashBalanceCalculator.GetBalanceAsync(_context, CashBoxType.Store, cancellationToken);
                if (changeDue > storeBalance)
                {
                    return new GenericResponse<string>
                    {
                        Data = null,
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_Sale_InsufficientChangeBalance,
                    };
                }
            }

            if (!ValidatePaymentAmounts(sale))
            {
                return new GenericResponse<string>
                {
                    Data = null,
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = Messages.Error_Payments_Dont_Match,
                };
            }

            if (exchangeSourceSale != null)
            {
                await ReturnProcessor.CreateAsync(
                    _context,
                    exchangeSourceSale,
                    request.Exchange!.Items,
                    RefundMethod.StoreCredit,
                    loggedInUser.Id,
                    sale.Id,
                    cancellationToken);
            }

            // -------------------------------
            // 7. SAVE SALE
            // -------------------------------
            _context.Sales.Add(sale);

            // Trade-in gold goes into the used-gold pool like any other purchase, but with
            // no cash movement — its value was already deducted from the sale total above.
            if (tradeInItems.Any())
            {
                var tradeInPurchase = new UsedGoldPurchase
                {
                    Id = Guid.NewGuid(),
                    SerialNumber = await GenerateUsedGoldPurchaseSerialNumber(),
                    CustomerId = sale.CustomerId,
                    CustomerName = customer!.Name,
                    CustomerPhone = customer.PhoneNumber,
                    PayMethod = UsedGoldPayMethod.TradeIn,
                    SaleId = sale.Id,
                    Notes = $"Trade-in on sale #{sale.SerialNumber}",
                };

                foreach (var item in tradeInItems)
                {
                    var itemSubtotal = item.Weight * item.PricePerGram;
                    tradeInPurchase.Items.Add(new UsedGoldPurchaseItem
                    {
                        Id = Guid.NewGuid(),
                        PurchaseId = tradeInPurchase.Id,
                        Karat = item.Karat,
                        Weight = item.Weight,
                        PricePerGram = item.PricePerGram,
                        Subtotal = itemSubtotal,
                    });
                }

                tradeInPurchase.TotalWeight = tradeInPurchase.Items.Sum(i => i.Weight);
                tradeInPurchase.TotalAmount = tradeInPurchase.Items.Sum(i => i.Subtotal);

                _context.UsedGoldPurchases.Add(tradeInPurchase);
            }

            // Cash portion of the payment goes straight into the store cash box.
            if (sale.CashAmount.HasValue && sale.CashAmount.Value > 0)
            {
                _context.CashTransactions.Add(new CashTransaction
                {
                    Id = Guid.NewGuid(),
                    BoxType = CashBoxType.Store,
                    Type = CashTransactionType.SaleCashIn,
                    Amount = sale.CashAmount.Value,
                    SaleId = sale.Id,
                    Notes = $"Sale #{sale.SerialNumber}",
                });
            }

            // Change owed to the customer (trade-in/exchange credit exceeded the sale total)
            // comes back out of the store cash box.
            if (changeDue > 0)
            {
                _context.CashTransactions.Add(new CashTransaction
                {
                    Id = Guid.NewGuid(),
                    BoxType = CashBoxType.Store,
                    Type = CashTransactionType.SaleChangeOut,
                    Amount = changeDue,
                    SaleId = sale.Id,
                    Notes = $"Change paid on sale #{sale.SerialNumber}",
                });
            }

            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<string>
            {
                Data = sale.Id.ToString(),
                StatusCode = ResponseStatusCode.Created,
                Message = Messages.Success
            };
        }



        private async Task<(GenericResponse<string>? Error, Customer? Customer)> ValidateRequestAsync(CreateSaleCommand request, CancellationToken cancellationToken)
        {
            if (!request.SaleItems.Any())
            {
                return (new GenericResponse<string>
                {
                    Data = null,
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = Messages.Error_Sale_MustContain_Items
                }, null);
            }

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Id == request.CustomerId, cancellationToken);

            if (customer == null)
            {
                return (new GenericResponse<string>
                {
                    Data = null,
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = Messages.Error_Customer_Not_Found
                }, null);
            }

            return (null, customer);
        }


        private async Task<List<Product>> StageNewProductsAsync(List<SaleItemDto> items)
        {
            var newProducts = new List<Product>();

            var newItems = items.Where(i => i.IsManualProduct || i.IsNewProduct).ToList();

            var skus = new Dictionary<SaleItemDto, string>();
            foreach (var item in newItems.Where(i => i.IsNewProduct))
            {
                skus[item] = await _skuService.GenerateSkuAsync(item.Category ?? ProductCategory.Necklaces);
            }

            foreach (var item in newItems)
            {
                var newProductId = Guid.NewGuid();
                item.ProductId = newProductId;

                newProducts.Add(item.IsNewProduct
                    ? new Product
                    {
                        Id = newProductId,
                        Name = item.ProductName,
                        Sku = skus[item],
                        KaratType = item.KaratType,
                        Weight = item.Weight,
                        Category = item.Category,
                        Specification = item.Specification,
                        Type = item.ProductType,
                        Description = string.Empty,
                        Quantity = item.StockQuantity > 0 ? item.StockQuantity : item.Quantity,
                        CreatedDate = DateTime.UtcNow
                    }
                    : new Product
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
                await _context.Products.AddRangeAsync(newProducts);

            return newProducts;
        }



        private SaleItem CreateSaleItem(Guid saleId, Product product, SaleItemDto item)
        {
            decimal pricePerGram = item.OverriddenPricePerGram ?? item.OriginalPricePerGram;
            // Use the sold weight from the request (item.Weight) to calculate the price per line
            decimal itemPrice = item.Weight * pricePerGram;
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
            int qty = item.Quantity > 0 ? item.Quantity : 1;

            if (product.Quantity.HasValue && product.Quantity > 0)
            {
                product.Quantity -= qty;
            }

            // Replace product weight with the incoming sold weight (do not subtract)
            if (item.Weight > 0)
            {
                product.Weight = item.Weight;
            }

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
            string today = BusinessTimeZoneHelper.GetEdmontonDate().ToString("yyyyMMdd");
            string prefix = "SALE";

            int countToday = await _context.Sales
                .CountAsync(x => x.SerialNumber.StartsWith($"{prefix}-{today}"));

            return $"{prefix}-{today}-{(countToday + 1).ToString("D4")}";
        }

        private async Task<string> GenerateUsedGoldPurchaseSerialNumber()
        {
            string today = BusinessTimeZoneHelper.GetEdmontonDate().ToString("yyyyMMdd");
            string prefix = "UGP";

            int countToday = await _context.UsedGoldPurchases
                .CountAsync(x => x.SerialNumber.StartsWith($"{prefix}-{today}"));

            return $"{prefix}-{today}-{(countToday + 1).ToString("D4")}";
        }

    }
}
