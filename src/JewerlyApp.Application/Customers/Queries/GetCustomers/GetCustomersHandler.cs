using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

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

            IQueryable<Customer> customersQuery = _context.Customers.AsNoTracking();

            // APPLY SEARCH
            customersQuery = ApplySearch(customersQuery, request.SearchBy);

            // TOTAL COUNT
            int totalRecords = await customersQuery.CountAsync(cancellationToken);


            var paginatedCustomers = await customersQuery.ApplySorting(request.SortBy, request.SortDirection)
                .ApplyPagination(request.PageNumber, request.PageSize)
                .ToListAsync(cancellationToken);

            var customerIds = paginatedCustomers.Select(c => c.Id).ToList();

            // AGGREGATION QUERY (SQL ONLY)
            var salesAgg = await _context.Sales
                .Where(s => customerIds.Contains(s.CustomerId))
                .GroupBy(s => s.CustomerId)
                .Select(g => new
                {
                    CustomerId = g.Key,
                    TotalProducts = g.SelectMany(s => s.SaleItems).Sum(si => si.Quantity),
                    TotalSales = g.SelectMany(s => s.SaleItems).Sum(si => si.Quantity * si.Weight * si.OverriddenPricePerGram) - g.Sum(s => s.Discount),

                    TotalDiscount = g.Sum(s => s.Discount),

                    Total18K = g.SelectMany(s => s.SaleItems)
                               .Where(si => si.KaratType == KaratType.Karat18)
                               .Sum(si => si.Quantity * si.Weight),

                    Total21K = g.SelectMany(s => s.SaleItems)
                               .Where(si => si.KaratType == KaratType.Karat21)
                               .Sum(si => si.Quantity * si.Weight)
                })
                .ToDictionaryAsync(g => g.CustomerId, cancellationToken);

            // MAP RESULTS
            var result = paginatedCustomers
                .Select(c =>
                {
                    salesAgg.TryGetValue(c.Id, out var s);

                    return new GetCustomersVM
                    {
                        Id = c.Id,
                        Name = c.Name,
                        PhoneNumber = c.PhoneNumber ?? "",
                        Email = c.Email ?? "",
                        Birthday = c.Birthday,
                        TotalProductsPurchased = s?.TotalProducts ?? 0,
                        TotalPurchasesValue = s?.TotalSales ?? 0,
                        TotalDiscount = s?.TotalDiscount ?? 0,
                        Total18K = s?.Total18K ?? 0,
                        Total21K = s?.Total21K ?? 0
                    };
                })
                .ToList();

            return new PaginatedResponse<GetCustomersVM>
            {
                Data = result,
                StatusCode = totalRecords > 0 ? ResponseStatusCode.Success : ResponseStatusCode.NoContent,
                Message = Messages.Success,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = totalRecords
            };
        }

        private IQueryable<Customer> ApplySearch(IQueryable<Customer> query, string? searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return query;

            searchTerm = searchTerm.ToLower();

            return query.Where(c =>
                c.Name.ToLower().Contains(searchTerm) ||
                c.Email.ToLower().Contains(searchTerm) ||
                (c.PhoneNumber != null && c.PhoneNumber.Contains(searchTerm)));
        }




    }
}
