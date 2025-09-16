using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Carts.Commands.RemoveProductFromCart
{
    public class RemoveProductFromCartHandler : IRequestHandler<RemoveProductFromCartCommand, GenericResponse<string>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserService _userService;

        public RemoveProductFromCartHandler(IApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<GenericResponse<string>> Handle(RemoveProductFromCartCommand request, CancellationToken cancellationToken)
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
                .Include(c => c.Products)
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

            var cartProduct = cart.Products.FirstOrDefault(cp => cp.ProductId == request.ProductId);

            if (cartProduct == null)
            {
                return new GenericResponse<string>
                {
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.PosItemNotFound
                };
            }

            _context.CartProducts.Remove(cartProduct);

            cart.SubTotal -= (cartProduct.Product.Weight * cartProduct.OriginalPricePerGram.GetValueOrDefault());

            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<string>
            {
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.SuccessItemDeleted
            };
        }
    }
}
