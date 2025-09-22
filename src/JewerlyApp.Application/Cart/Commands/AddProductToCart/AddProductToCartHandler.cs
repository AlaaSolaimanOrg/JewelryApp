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
using System.Collections.Generic;

namespace JewerlyApp.Application.Carts.Commands.AddProductToCart
{
    public class AddProductToCartHandler : IRequestHandler<AddProductToCartCommand, GenericResponse<string>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserService _userService;

        public AddProductToCartHandler(IApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<GenericResponse<string>> Handle(AddProductToCartCommand request, CancellationToken cancellationToken)
        {
            var loggedInUser = await _userService.GetLoggedInUser();

            if (loggedInUser == null)
            {
                return new GenericResponse<string>
                {
                    StatusCode = ResponseStatusCode.Unauthorized,
                    Message = Messages.ErrorForbidden
                };
            }

            var cart = await _context.Carts.Include(x => x.Products)                
                .FirstOrDefaultAsync(c => c.CreatedBy == loggedInUser.Id, cancellationToken);

            // If the user does not have a cart, create a new one.
            if (cart == null)
            {
                cart = new Cart
                {
                    Id = Guid.NewGuid(),
                    CreatedBy = loggedInUser.Id,
                    CreatedDate = DateTime.UtcNow,
                    SubTotal = 0,
                    Taxes = 0,
                    Discount = 0,
                    Products = new List<CartProduct>()
                };
                await _context.Carts.AddAsync(cart, cancellationToken);
            }

            var product = await _context.Products.FindAsync(new object[] { request.ProductId }, cancellationToken);
            if (product == null)
            {
                return new GenericResponse<string>
                {
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.PosItemNotFound
                };
            }

            var priceSetting = await _context.PricingSettings.FirstOrDefaultAsync(ps =>
                ps.ProductType == product.Type &&
                ps.KaratType == product.KaratType, cancellationToken);

            if (priceSetting == null)
            {
                return new GenericResponse<string>
                {
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = $"Pricing setting for {product.Type} with {product.KaratType} is missing."
                };
            }

            if(priceSetting.Price != request.Price)
            {
                return new GenericResponse<string>
                {
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = Messages.Error_Invalid_Price,
                };
            }

            var existingCartProduct = cart.Products.FirstOrDefault(cp => cp.ProductId == request.ProductId);

            if (existingCartProduct != null)
            {
                // If the product already exists, return an error since we are not tracking quantity.
                return new GenericResponse<string>
                {
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = Messages.ErrorInvalidInput
                };
            }

            // Create a new CartProduct.
            var newCartProduct = new CartProduct
            {
                Id = Guid.NewGuid(),
                CartId = cart.Id,
                ProductId = request.ProductId,
                OriginalPricePerGram = priceSetting.Price,
                OverriddenPricePerGram = null
            };
            await _context.CartProducts.AddAsync(newCartProduct, cancellationToken);

            // Recalculate the subtotal of the entire cart.
            cart.SubTotal += product.Weight * newCartProduct.OriginalPricePerGram.GetValueOrDefault();

            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<string>
            {
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.SuccessItemAdded
            };
        }
    }
}
