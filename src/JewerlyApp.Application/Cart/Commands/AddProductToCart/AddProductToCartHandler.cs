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

            var cart = await _context.Carts.Include(x => x.CartProducts)                
                .FirstOrDefaultAsync(c => c.CreatedBy == loggedInUser.Id, cancellationToken);

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
                    CartProducts = new List<CartProduct>()
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
                    StatusCode = ResponseStatusCode.InternalServerError,
                    Message = Messages.Error_Pricing_Settings
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

            var existingCartProduct = cart.CartProducts.FirstOrDefault(cp => cp.ProductId == request.ProductId);

            if (existingCartProduct != null)
            {
                return new GenericResponse<string>
                {
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = Messages.ErrorInvalidInput
                };
            }

            var newCartProduct = new CartProduct
            {
                Id = Guid.NewGuid(),
                CartId = cart.Id,
                ProductId = request.ProductId,
                OriginalPricePerGram = priceSetting.Price,
                OverriddenPricePerGram = null
            };
            await _context.CartProducts.AddAsync(newCartProduct, cancellationToken);

            cart.SubTotal += product.Weight * newCartProduct.OriginalPricePerGram.GetValueOrDefault();

            cart.Total = cart.SubTotal + cart.Taxes - (cart.Discount ?? 0);

            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<string>
            {
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.SuccessItemAdded
            };
        }
    }
}
