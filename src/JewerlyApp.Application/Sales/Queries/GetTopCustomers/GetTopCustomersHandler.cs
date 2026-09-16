using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetTopCustomers
{
    public class GetTopCustomersHandler : IRequestHandler<GetTopCustomersQuery, GenericResponse<List<TopCustomerVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetTopCustomersHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<TopCustomerVM>>> Handle(GetTopCustomersQuery request, CancellationToken cancellationToken)
        {
            var salesQuery = _context.Sales.AsQueryable();

            if (request.DateFrom.HasValue)
            {
                salesQuery = salesQuery.Where(s => s.CreatedDate >= request.DateFrom.Value);
            }

            if (request.DateTo.HasValue)
            {
                salesQuery = salesQuery.Where(s => s.CreatedDate <= request.DateTo.Value);
            }

            var topCustomers = await salesQuery
                .GroupBy(s => new { s.CustomerId, s.Customer!.Name })
                .Select(g => new TopCustomerVM
                {
                    Name = g.Key.Name,
                    Transactions = g.Count(),
                    Spent = g.Sum(s => s.Total),
                })
                .OrderByDescending(c => c.Spent)
                .Take(request.Top)
                .ToListAsync(cancellationToken);

            return new GenericResponse<List<TopCustomerVM>>
            {
                Data = topCustomers,
                StatusCode = Domain.Enums.ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
