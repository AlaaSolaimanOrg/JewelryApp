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
    public class GetCustomersQueryHandler : IRequestHandler<GetCustomersQuery, PaginatedResponse<GetCustomersVM>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserService _userService;

        public GetCustomersQueryHandler(IApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<PaginatedResponse<GetCustomersVM>> Handle(GetCustomersQuery request, CancellationToken cancellationToken)
        {
            var loggedInUser = await _userService.GetLoggedInUser();

            if (loggedInUser == null)
            {
                return new PaginatedResponse<GetCustomersVM>
                {
                    Data = new List<GetCustomersVM>(),
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

            var customerIds = paginatedCustomers.Select(c => c.Id).ToList();

            var salesWithItems = await _context.Sales
                .Where(s => customerIds.Contains(s.CustomerId))
                .Select(s => new
                {
                    s.CustomerId,
                    ProductCount = s.SaleItems.Sum(i => i.Quantity)
                })
                .ToListAsync(cancellationToken);

            var totalProductsByCustomer = salesWithItems
                .GroupBy(x => x.CustomerId)
                .ToDictionary(g => g.Key, g => g.Sum(x => x.ProductCount));

            var customerListItems = paginatedCustomers
                .Select(c => new GetCustomersVM
                {
                    Id = c.Id,
                    Name = c.Name,
                    Email = c.Email,
                    PhoneNumber = c.PhoneNumber ?? string.Empty,
                    Birthday = c.Birthday,
                    TotalProductsPurchased = totalProductsByCustomer.ContainsKey(c.Id)
                        ? totalProductsByCustomer[c.Id]
                        : 0
                })
                .ToList();

            return new PaginatedResponse<GetCustomersVM>
            {
                Data = customerListItems,
                StatusCode = totalRecords > 0 ? ResponseStatusCode.Success : ResponseStatusCode.NoContent,
                Message = Messages.Success,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = totalRecords
            };
        }

    }
}
