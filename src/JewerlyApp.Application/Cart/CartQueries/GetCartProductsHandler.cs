using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Carts.Queries.GetCartProducts
{
    public class GetCartProductsHandler : IRequestHandler<GetCartProductsQuery, GenericResponse<List<GetCartProductsVM>>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserService _userService;

        public GetCartProductsHandler(IApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<GenericResponse<List<GetCartProductsVM>>> Handle(GetCartProductsQuery request, CancellationToken cancellationToken)
        {
            var loggedInUser = await _userService.GetLoggedInUser();

            if (loggedInUser == null)
            {
                return new GenericResponse<List<GetCartProductsVM>>
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
                return new GenericResponse<List<GetCartProductsVM>>
                {
                    Data = new List<GetCartProductsVM>(),
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.PosCartEmpty
                };
            }

            var cartProducts = cart.Products
                .Select(cp => new GetCartProductsVM
                {
                    ProductId = cp.ProductId,
                    Sku = cp.Product.Sku,
                    Name = cp.Product.Name,
                    KaratType = (int)cp.Product.KaratType,
                    Weight = cp.Product.Weight,
                    PricePerGram = cp.OriginalPricePerGram.GetValueOrDefault()
                })
                .ToList();

            return new GenericResponse<List<GetCartProductsVM>>
            {
                Data = cartProducts,
                StatusCode = ResponseStatusCode.Success
            };
        }
    }
}
