using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Products.Commands.CreateProduct;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

                foreach (var item in request.SaleItems)
                {
                    // Validate product exists and get current price
                    var product = await _context.Products
                        .FirstOrDefaultAsync(p => p.Id == item.ProductId, cancellationToken);

                    if (product == null)
                        return new GenericResponse<string>
                        {
                            Data = null,
                            StatusCode = ResponseStatusCode.BadRequest,
                            Message = "Product not found"
                        };

                    // Use overridden price or get current price from product
                    var pricePerGram = item.OverriddenPricePerGram ?? item.OriginalPricePerGram ;

                    var itemSubTotal = Math.Round(item.Weight * pricePerGram, 2, MidpointRounding.AwayFromZero);

                    var saleItem = new SaleItem
                    {
                        Id = Guid.NewGuid(),
                        SaleId = sale.Id,
                        ProductId = item.ProductId,
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

    }
}
