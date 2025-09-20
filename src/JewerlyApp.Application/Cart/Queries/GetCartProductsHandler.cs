using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

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

            if (!_context.Carts.Any(x => x.CreatedBy == loggedInUser.Id))
            {
                return new GenericResponse<List<GetCartProductsVM>>
                {
                    Data = new List<GetCartProductsVM>(),
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.PosCartEmpty
                };
            }


            var products = await _context.CartProducts
                .Where(x => x.Cart!.CreatedBy == loggedInUser.Id)
                .Select(cp => new GetCartProductsVM
                {
                    ProductId = cp.ProductId,
                    Sku = cp.Product!.Sku,
                    Name = cp.Product.Name!,
                    KaratType = cp.Product.KaratType,
                    Weight = cp.Product.Weight,
                    PricePerGram = cp.OriginalPricePerGram.GetValueOrDefault()
                })
                .ToListAsync(cancellationToken);


            return new GenericResponse<List<GetCartProductsVM>>
            {
                Data = products,
                StatusCode = products.Any() ? ResponseStatusCode.Success : ResponseStatusCode.NoContent,
                Message = Messages.Success,
            };
        }
    }
}
