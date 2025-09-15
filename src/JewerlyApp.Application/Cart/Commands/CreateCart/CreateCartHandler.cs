using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using JewerlyApp.Application.Common.Messages;

namespace JewerlyApp.Application.Carts.Commands.CreateCart
{
    public class CreateCartHandler : IRequestHandler<CreateCartCommand, GenericResponse<string>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserService _userService;

        public CreateCartHandler(IApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<GenericResponse<string>> Handle(CreateCartCommand request, CancellationToken cancellationToken)
        {
            var loggedInUser = await _userService.GetLoggedInUser();
            

            // Check if a cart already exists for the current user based on the CreatedBy property.
            var existingCart = await _context.Carts
                .AnyAsync(c => c.CreatedBy == loggedInUser.Id, cancellationToken);

            if (existingCart)
            {
                // If a cart already exists, return a failure response with an appropriate message.
                return new GenericResponse<string>
                {
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = Messages.Error_Cart_Already_Exists,
                };
            }

            // Create a new cart entity. The CreatedBy field will be automatically populated
            // by the DbContext's SaveChangesAsync override.
            var cart = new Cart
            {
                Id = Guid.NewGuid(),
                SubTotal = 0,
                Taxes = 0,
                Products = new List<CartProduct>()
            };

            // Add the new cart to the database context.
            await _context.Carts.AddAsync(cart, cancellationToken);

            // Persist the changes to the database.
            await _context.SaveChangesAsync(cancellationToken);

            // Return a success response with the new cart's ID and a success message.
            return new GenericResponse<string>
            {
                Data = cart.Id.ToString(),
                StatusCode = ResponseStatusCode.Created,
                Message = Messages.SuccessCartCreated,
            };
        }
    }
}
