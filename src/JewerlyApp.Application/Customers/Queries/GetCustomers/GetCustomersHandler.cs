using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Customers.Queries.GetCustomers
{
    public class GetCustomersQueryHandler
        : IRequestHandler<GetCustomersQuery, PaginatedResponse<GetCustomersVM>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserService _userService;

        public GetCustomersQueryHandler(
            IApplicationDbContext context,
            IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<PaginatedResponse<GetCustomersVM>> Handle(
            GetCustomersQuery request,
            CancellationToken cancellationToken)
        {
            var loggedInUser = await _userService.GetLoggedInUser();
            if (loggedInUser == null)
            {
                return new PaginatedResponse<GetCustomersVM>
                {
                    Data = new(),
                    StatusCode = ResponseStatusCode.Unauthorized,
                    Message = Messages.ErrorGeneral
                };
            }

            // =========================================
            // BASE QUERY (CUSTOMERS + SALES AGGREGATION)
            // =========================================
            var query =
                from c in _context.Customers.AsNoTracking()
                join s in _context.Sales
                    on c.Id equals s.CustomerId into sales
                where c.IsActive == true
                select new GetCustomersVM
                {
                    Id = c.Id,
                    Name = c.Name,
                    PhoneNumber = c.PhoneNumber ?? "",
                    Email = c.Email ?? "",
                    Birthday = c.Birthday,

                    TotalProductsPurchased =
                        sales.SelectMany(x => x.SaleItems)
                             .Sum(si => (int?)si.Quantity) ?? 0,

                    TotalPurchasesValue =
                        (sales.SelectMany(x => x.SaleItems)
                              .Sum(si => (decimal?)
                                  (si.Quantity * si.Weight * si.OverriddenPricePerGram)) ?? 0)
                        - (sales.Sum(x => (decimal?)x.Discount) ?? 0),

                    TotalDiscount =
                        sales.Sum(x => (decimal?)x.Discount) ?? 0,

                    Total18K =
                        sales.SelectMany(x => x.SaleItems)
                             .Where(si => si.KaratType == KaratType.Karat18)
                             .Sum(si => (decimal?)(si.Quantity * si.Weight)) ?? 0,

                    Total21K =
                        sales.SelectMany(x => x.SaleItems)
                             .Where(si => si.KaratType == KaratType.Karat21)
                             .Sum(si => (decimal?)(si.Quantity * si.Weight)) ?? 0
                };

            // =========================================
            // SEARCH (SQL)
            // =========================================
            if (!string.IsNullOrWhiteSpace(request.SearchBy))
            {
                var search = request.SearchBy.ToLower();

                query = query.Where(c =>
                    c.Name.ToLower().Contains(search) ||
                    c.Email.ToLower().Contains(search) ||
                    c.PhoneNumber.Contains(search));
            }

            // =========================================
            // TOTAL COUNT (SQL)
            // =========================================
            int totalRecords =
                await query.CountAsync(cancellationToken);

            // =========================================
            // SORTING (SQL)
            // =========================================
            query = query.ApplySorting(
                request.SortBy,
                request.SortDirection
            );

            // =========================================
            // PAGINATION (SQL)
            // =========================================
            var result =
                await query
                    .ApplyPagination(
                        request.PageNumber,
                        request.PageSize)
                    .ToListAsync(cancellationToken);

            return new PaginatedResponse<GetCustomersVM>
            {
                Data = result,
                StatusCode = totalRecords > 0
                    ? ResponseStatusCode.Success
                    : ResponseStatusCode.NoContent,
                Message = Messages.Success,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = totalRecords
            };
        }
    }
}
