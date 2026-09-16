using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairsByCustomer
{
    public class GetRepairsByCustomerHandler : IRequestHandler<GetRepairsByCustomerQuery, GenericResponse<List<CustomerRevenueVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetRepairsByCustomerHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<CustomerRevenueVM>>> Handle(GetRepairsByCustomerQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Repairs
                .AsNoTracking()
                .Where(r => r.Status != RepairStatus.Cancelled);

            if (request.DateFrom.HasValue)
            {
                var from = DateOnly.FromDateTime(request.DateFrom.Value);
                query = query.Where(r => r.OrderDate >= from);
            }

            if (request.DateTo.HasValue)
            {
                var to = DateOnly.FromDateTime(request.DateTo.Value);
                query = query.Where(r => r.OrderDate <= to);
            }

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var search = request.Search.Trim();
                query = query.Where(r => r.Customer.Name.Contains(search));
            }

            var data = await query
                .Select(r => new { CustomerName = r.Customer.Name, r.Status, r.Cost })
                .ToListAsync(cancellationToken);

            var rows = data
                .GroupBy(r => r.CustomerName)
                .Select(g => new CustomerRevenueVM
                {
                    Name = g.Key,
                    Revenue = g.Where(r => r.Status == RepairStatus.PickedUp).Sum(r => r.Cost),
                    Count = g.Count(),
                })
                .OrderByDescending(c => c.Revenue)
                .ToList();

            return new GenericResponse<List<CustomerRevenueVM>>
            {
                Data = rows,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
