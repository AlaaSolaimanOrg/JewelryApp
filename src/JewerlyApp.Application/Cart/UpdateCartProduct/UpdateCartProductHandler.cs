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

namespace JewerlyApp.Application.Carts.Commands.UpdateCartProduct
{
    public class UpdateCartProductHandler : IRequestHandler<UpdateCartProductCommand, GenericResponse<string>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserService _userService;

        public UpdateCartProductHandler(IApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<GenericResponse<string>> Handle(UpdateCartProductCommand request, CancellationToken cancellationToken)
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

            var cart = await _context.Carts
                .Include(c => c.CartProducts)
                .ThenInclude(cp => cp.Product)
                .FirstOrDefaultAsync(c => c.CreatedBy == loggedInUser.Id, cancellationToken);

            if (cart == null)
            {
                return new GenericResponse<string>
                {
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.PosCartEmpty
                };
            }

            var cartProduct = cart.CartProducts.FirstOrDefault(cp => cp.ProductId == request.ProductId);
            if (cartProduct == null)
            {
                return new GenericResponse<string>
                {
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.PosItemNotFound
                };
            }
            decimal newOverriddenPricePerGram;

            if (request.DiscountType == DiscountType.Percentage)
            {
                if (request.Discount < 0 || request.Discount > 100)
                {
                    return new GenericResponse<string>
                    {
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_Percentage_Discount
                    };
                }
                newOverriddenPricePerGram = cartProduct.OriginalPricePerGram.GetValueOrDefault() * (1 - (request.Discount / 100));
            }
            else
            {
                if (request.Discount < 0)
                {
                    return new GenericResponse<string>
                    {
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_Discount
                    };
                }
                var productWeight = cartProduct.Product?.Weight ?? 0;
                var currentPrice = cartProduct.OriginalPricePerGram.GetValueOrDefault();
                var totalPrice = productWeight * currentPrice;
                var newTotalPrice = totalPrice - request.Discount;

                if (newTotalPrice < 0)
                {
                    return new GenericResponse<string>
                    {
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_Discount_Result
                    };
                }

                newOverriddenPricePerGram = newTotalPrice / productWeight;
            }
            cartProduct.OverriddenPricePerGram = newOverriddenPricePerGram;

            cart.SubTotal = cart.CartProducts.Sum(cp =>
                (cp.OverriddenPricePerGram ?? cp.OriginalPricePerGram.GetValueOrDefault()) *
                (cp.Product?.Weight ?? 0)
            );

            cart.Total = cart.SubTotal + cart.Taxes - (cart.Discount ?? 0);

            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<string>
            {
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.SuccessItemUpdated
            };
        }
    }
}
