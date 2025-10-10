using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Sales.Queries.GetSoldItems;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace JewerlyApp.Application.Sales.Queries.GetSalesCustomers
{
    internal class GetSalesCustomersHandler : IRequestHandler<GetSalesCustomersQuery, PaginatedResponse<GetSalesCustomersVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetSalesCustomersHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResponse<GetSalesCustomersVM>> Handle(GetSalesCustomersQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Sales
                .Select(s => new GetSalesCustomersVM
                {
                    CustomerId = s.CustomerId,
                    CustomerName = s.Customer!.Name,
                    Email = s.Customer.Email ?? string.Empty,
                    PhoneNumber = s.Customer.PhoneNumber ?? string.Empty,
                    NotesRemarks = s.Note ?? string.Empty,
                    SaleId = s.Id,
                    CreatedDate = s.CreatedDate,
                });

            // Apply date range filter
            if (request.DateFrom.HasValue)
            {
                query = query.Where(s => s.CreatedDate >= request.DateFrom.Value);
            }

            if (request.DateTo.HasValue)
            {
                query = query.Where(s => s.CreatedDate <= request.DateTo.Value);
            }

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(request.SearchBy))
            {
                var keyword = request.SearchBy.Trim();
                query = query.Where(s =>                    
                        s.CustomerName.Contains(keyword) ||
                        s.Email.Contains(keyword) ||
                        s.PhoneNumber.Contains(keyword)
                    );
            }

            if (string.IsNullOrEmpty(request.SortBy))
            {
                query = query.OrderByDescending(s => s.CreatedDate);
            }

            var totalRecords = await query.CountAsync(cancellationToken);

            var result = await query.ApplySorting(request.SortBy!, request.SortDirection)
                .ApplyPagination(request.PageNumber, request.PageSize)
                .ToListAsync(cancellationToken);

            return new PaginatedResponse<GetSalesCustomersVM>
            {
                Data = result,
                StatusCode = Domain.Enums.ResponseStatusCode.Success,
                Message = Messages.Success,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = totalRecords,
            };
        }
    }
}
