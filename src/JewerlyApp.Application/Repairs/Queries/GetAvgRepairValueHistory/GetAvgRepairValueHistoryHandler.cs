using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs.Queries.GetAvgRepairValueHistory
{
    public class GetAvgRepairValueHistoryHandler : IRequestHandler<GetAvgRepairValueHistoryQuery, GenericResponse<List<AvgValueHistoryVM>>>
    {
        private static readonly string[] MonthAbbr = CultureInfo.InvariantCulture.DateTimeFormat.AbbreviatedMonthNames;

        private readonly IApplicationDbContext _context;

        public GetAvgRepairValueHistoryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<AvgValueHistoryVM>>> Handle(GetAvgRepairValueHistoryQuery request, CancellationToken cancellationToken)
        {
            var completed = await _context.Repairs
                .AsNoTracking()
                .Where(r => r.Status == RepairStatus.PickedUp && r.PickedUpDate.HasValue)
                .Select(r => new { r.PickedUpDate, r.Cost })
                .ToListAsync(cancellationToken);

            var rows = completed
                .GroupBy(r => new { r.PickedUpDate!.Value.Year, r.PickedUpDate.Value.Month })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    Count = g.Count(),
                    Total = g.Sum(r => r.Cost),
                })
                .OrderByDescending(g => g.Year)
                .ThenByDescending(g => g.Month)
                .Select(g => new AvgValueHistoryVM
                {
                    Label = $"{MonthAbbr[g.Month - 1]} {g.Year}",
                    Avg = g.Count > 0 ? g.Total / g.Count : 0,
                    Count = g.Count,
                    Total = g.Total,
                })
                .ToList();

            return new GenericResponse<List<AvgValueHistoryVM>>
            {
                Data = rows,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
