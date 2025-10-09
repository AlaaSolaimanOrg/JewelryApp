using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using JewerlyApp.Application.Customers.Queries.GetCustomers;

namespace JewerlyApp.Application.Customers.Queries.GetCustomer
{
    public class GetCustomerQueryHandler : IRequestHandler<GetCustomerQuery, GenericResponse<GetCustomersVM>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserService _userService;

        public GetCustomerQueryHandler(IApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<GenericResponse<GetCustomersVM>> Handle(GetCustomerQuery request, CancellationToken cancellationToken)
        {
            var loggedInUser = await _userService.GetLoggedInUser();

            if (loggedInUser == null)
            {
                return new GenericResponse<GetCustomersVM>
                {
                    Data = null,
                    StatusCode = ResponseStatusCode.Unauthorized,
                    Message = Messages.ErrorGeneral
                };
            }

            if (string.IsNullOrWhiteSpace(request.SearchBy))
            {
                return new GenericResponse<GetCustomersVM>
                {
                    Data = null,
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = "Search term is required."
                };
            }

            string term = request.SearchBy.ToLower();

            var customer = await _context.Customers
                .AsNoTracking()
                .Where(c =>
                    c.Name.ToLower().Contains(term) ||
                    c.Email.ToLower().Contains(term) ||
                    (c.PhoneNumber != null && c.PhoneNumber.Contains(term)))
                .OrderBy(c => c.Name) // optional: choose consistent ordering
                .FirstOrDefaultAsync(cancellationToken);

            if (customer == null)
            {
                return new GenericResponse<GetCustomersVM>
                {
                    Data = null,
                    StatusCode = ResponseStatusCode.NoContent,
                    Message = "No customer found."
                };
            }

            var customerVm = new GetCustomersVM
            {
                Id = customer.Id,
                Name = customer.Name,
                Email = customer.Email,
                PhoneNumber = customer.PhoneNumber ?? string.Empty,
                Birthday = customer.Birthday,
            };

            return new GenericResponse<GetCustomersVM>
            {
                Data = customerVm,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
