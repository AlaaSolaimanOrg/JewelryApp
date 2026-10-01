using JewerlyApp.Application.Common.Helpers;
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

namespace JewerlyApp.Application.Repairs.Queries.GetLongestInShop
{
    public class GetLongestInShopHandler : IRequestHandler<GetLongestInShopQuery, GenericResponse<List<LongestInShopVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetLongestInShopHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<LongestInShopVM>>> Handle(GetLongestInShopQuery request, CancellationToken cancellationToken)
        {
            var today = BusinessTimeZoneHelper.GetEdmontonDate();

            var active = await _context.Repairs
                .AsNoTracking()
                .Where(r => r.Status == RepairStatus.InProgress || r.Status == RepairStatus.Completed)
                .Select(r => new { r.RepairCode, CustomerName = r.Customer.Name, r.OrderDate })
                .OrderBy(r => r.OrderDate)
                .ToListAsync(cancellationToken);

            var rows = active
                .Select(r => new LongestInShopVM
                {
                    RepairId = r.RepairCode,
                    Customer = r.CustomerName,
                    Days = today.DayNumber - r.OrderDate.DayNumber,
                })
                .ToList();

            return new GenericResponse<List<LongestInShopVM>>
            {
                Data = rows,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
