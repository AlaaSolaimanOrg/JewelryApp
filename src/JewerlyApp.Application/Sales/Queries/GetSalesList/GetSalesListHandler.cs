using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Sales.Queries.GetSaleById;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace JewerlyApp.Application.Sales.Queries.GetSalesList
{
    internal class GetSalesListHandler : IRequestHandler<GetSalesListQuery, PaginatedResponse<GetSalesListVM>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserService _userService;

        public GetSalesListHandler(IApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<PaginatedResponse<GetSalesListVM>> Handle(GetSalesListQuery request, CancellationToken cancellationToken)
        {
            var loggedInUser = await _userService.GetLoggedInUser();

            var query = _context.Sales
                .Where(x => x.CreatedBy == loggedInUser.Id)
                .Select(x => new GetSalesListVM
                {
                    Id = x.Id,
                    SerialNumber = 1,
                    CreatedDate = x.CreatedDate,
                    Total = x.Total,
                    CardPayment = x.CardAmount != 0,
                    CashPayment = x.CashAmount != 0,
                });

            if (!string.IsNullOrEmpty(request.SearchBy))
            {
                var keyword = request.SearchBy.Trim();

                query = query.Where(x => x.SerialNumber.ToString().Contains(keyword) ||
                                     x.Total.ToString().Contains(keyword)
                );
            }

            var totalRecords = await query.CountAsync(cancellationToken);
            var sales = await query.ApplySorting(request.SortBy!, request.SortDirection)
                .ApplyPagination(request.PageNumber, request.PageSize)
                .ToListAsync(cancellationToken);


            return new PaginatedResponse<GetSalesListVM>
            {
                Data = sales,
                TotalRecords = totalRecords,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                StatusCode = sales.Any() ? ResponseStatusCode.Success : ResponseStatusCode.NoContent,
            };
        }
    }
}
