using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Carts.Commands.UpdateCart
{
    public class UpdateCartHandler : IRequestHandler<UpdateCartCommand, GenericResponse<Guid>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserService _userService;

        public UpdateCartHandler(IApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<GenericResponse<Guid>> Handle(UpdateCartCommand request, CancellationToken cancellationToken)
        {
            var loggedInUser = await _userService.GetLoggedInUser();
            if (loggedInUser == null)
            {
                return new GenericResponse<Guid>
                {
                    StatusCode = ResponseStatusCode.Unauthorized,
                    Message = Messages.ErrorForbidden
                };
            }

            var cart = await _context.Carts
                .FirstOrDefaultAsync(c => c.CreatedBy == loggedInUser.Id, cancellationToken);

            if (cart == null)
            {
                return new GenericResponse<Guid>
                {
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.PosCartEmpty
                };
            }

            cart.Discount = request.Discount;
            cart.DiscountType = request.DiscountType;

            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<Guid>
            {
                Data = cart.Id,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.SuccessItemUpdated
            };
        }
    }
}
