using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Analytics.Queries.GetCustomerRetention
{
    public class GetCustomerRetentionHandler : IRequestHandler<GetCustomerRetentionQuery, GenericResponse<List<CustomerRetentionVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetCustomerRetentionHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<CustomerRetentionVM>>> Handle(GetCustomerRetentionQuery request, CancellationToken cancellationToken)
        {
            // Apply Date Range
            DateTime dateFrom, dateTo;
            if (request.ReportType.HasValue)
            {
                (dateFrom, dateTo) = DateRangeHelper.GetDateRange(request.ReportType.Value);
            }
            else
            {
                dateFrom = DateTime.MinValue;
                dateTo = DateTime.MaxValue;
            }

            if (request.DateFrom.HasValue) dateFrom = request.DateFrom.Value;
            if (request.DateTo.HasValue) dateTo = request.DateTo.Value;

            // Group sales by customer and count purchases per customer
            var customerPurchaseCounts = await _context.Sales
                .AsNoTracking()
                .Where(s => s.CreatedDate >= dateFrom && s.CreatedDate <= dateTo)
                .GroupBy(s => s.CustomerId)
                .Select(g => new { CustomerId = g.Key, PurchaseCount = g.Count() })
                .ToListAsync(cancellationToken);

            var totalCustomers = customerPurchaseCounts.Count;

            if (totalCustomers == 0)
            {
                return new GenericResponse<List<CustomerRetentionVM>>
                {
                    Data = new List<CustomerRetentionVM>(),
                    StatusCode = Domain.Enums.ResponseStatusCode.Success,
                    Message = Messages.Success
                };
            }

            var newCustomerCount = customerPurchaseCounts.Count(c => c.PurchaseCount == 1);
            var regularCustomerCount = customerPurchaseCounts.Count(c => c.PurchaseCount > 1);

            var result = new List<CustomerRetentionVM>
            {
                new CustomerRetentionVM
                {
                    Label = "New Customers",
                    Count = newCustomerCount,
                    Percentage = Math.Round((decimal)newCustomerCount / totalCustomers * 100, 1)
                },
                new CustomerRetentionVM
                {
                    Label = "Regular Customers",
                    Count = regularCustomerCount,
                    Percentage = Math.Round((decimal)regularCustomerCount / totalCustomers * 100, 1)
                }
            };

            return new GenericResponse<List<CustomerRetentionVM>>
            {
                Data = result,
                StatusCode = Domain.Enums.ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
