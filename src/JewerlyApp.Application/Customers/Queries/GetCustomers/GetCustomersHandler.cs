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

namespace JewerlyApp.Application.Customers.Queries.GetCustomers
{
    public class GetCustomersQueryHandler : IRequestHandler<GetCustomersQuery, GenericResponse<PaginatedResponse<GetCustomersVM>>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserService _userService;

        public GetCustomersQueryHandler(IApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<GenericResponse<PaginatedResponse<GetCustomersVM>>> Handle(GetCustomersQuery request, CancellationToken cancellationToken)
        {
            var loggedInUser = await _userService.GetLoggedInUser();

            if (loggedInUser == null)
            {
                var unauthorizedInnerResponse = new PaginatedResponse<GetCustomersVM>
                {
                    Data = new List<GetCustomersVM>(),
                    StatusCode = ResponseStatusCode.Unauthorized,
                    Message = Messages.ErrorGeneral
                };

                return new GenericResponse<PaginatedResponse<GetCustomersVM>>
                {
                    Data = unauthorizedInnerResponse,
                    StatusCode = ResponseStatusCode.Unauthorized,
                    Message = Messages.ErrorGeneral
                };
            }

            IQueryable<Customer> customersQuery = _context.Customers.AsQueryable().AsNoTracking();

            if (!string.IsNullOrWhiteSpace(request.SearchBy))
            {
                string term = request.SearchBy.ToLower();
                customersQuery = customersQuery.Where(c =>
                    c.Name.ToLower().Contains(term) ||
                    c.Email.ToLower().Contains(term) ||
                    (c.PhoneNumber != null && c.PhoneNumber.Contains(term)));
            }

            int totalRecords = await customersQuery.CountAsync(cancellationToken);

            string sortBy = request.SortBy?.ToLower() ?? "name";

            string sortDirection = request.SortDirection.ToString().ToLower();

            customersQuery = sortBy switch
            {
                "email" => sortDirection == "descending"
                    ? customersQuery.OrderByDescending(c => c.Email)
                    : customersQuery.OrderBy(c => c.Email),
                "birthday" => sortDirection == "descending"
                    ? customersQuery.OrderByDescending(c => c.Birthday)
                    : customersQuery.OrderBy(c => c.Birthday),
                "createddate" => sortDirection == "descending"
                    ? customersQuery.OrderByDescending(c => c.CreatedDate)
                    : customersQuery.OrderBy(c => c.CreatedDate),
                _ => sortDirection == "descending"
                    ? customersQuery.OrderByDescending(c => c.Name)
                    : customersQuery.OrderBy(c => c.Name),
            };

            int skip = (request.PageNumber - 1) * request.PageSize;

            var paginatedCustomers = await customersQuery
                .Skip(skip)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var customerListItems = paginatedCustomers
                .Select(c => new GetCustomersVM
                {
                    Id = c.Id,
                    Name = c.Name,
                    Email = c.Email,
                    PhoneNumber = c.PhoneNumber ?? string.Empty,
                    Birthday = c.Birthday,
                })
                .ToList();

            var paginatedResponse = new PaginatedResponse<GetCustomersVM>
            {
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = totalRecords,

                Data = customerListItems
            };

            return new GenericResponse<PaginatedResponse<GetCustomersVM>>
            {
                Data = paginatedResponse,
                StatusCode = totalRecords > 0 ? ResponseStatusCode.Success : ResponseStatusCode.NoContent,
                Message = Messages.Success
            };
        }
    }
}
