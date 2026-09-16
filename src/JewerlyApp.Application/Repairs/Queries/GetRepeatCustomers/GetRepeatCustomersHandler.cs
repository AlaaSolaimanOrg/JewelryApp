using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs.Queries.GetRepeatCustomers
{
    public class GetRepeatCustomersHandler : IRequestHandler<GetRepeatCustomersQuery, GenericResponse<List<RepeatCustomerVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetRepeatCustomersHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<RepeatCustomerVM>>> Handle(GetRepeatCustomersQuery request, CancellationToken cancellationToken)
        {
            var rows = await _context.Repairs
                .AsNoTracking()
                .Where(r => r.Status != RepairStatus.Cancelled)
                .GroupBy(r => r.Customer.Name)
                .Where(g => g.Count() > 1)
                .Select(g => new RepeatCustomerVM { Name = g.Key, Count = g.Count() })
                .OrderByDescending(c => c.Count)
                .ToListAsync(cancellationToken);

            return new GenericResponse<List<RepeatCustomerVM>>
            {
                Data = rows,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
