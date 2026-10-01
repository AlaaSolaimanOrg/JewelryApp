using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairsRevenueChart
{
    public class GetRepairsRevenueChartHandler : IRequestHandler<GetRepairsRevenueChartQuery, GenericResponse<List<ChartPointVM>>>
    {
        private static readonly string[] MonthAbbr = CultureInfo.InvariantCulture.DateTimeFormat.AbbreviatedMonthNames;

        private readonly IApplicationDbContext _context;

        public GetRepairsRevenueChartHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<ChartPointVM>>> Handle(GetRepairsRevenueChartQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Repairs
                .AsNoTracking()
                .Where(r => r.Status == RepairStatus.PickedUp && r.PickedUpDate.HasValue);

            var from = request.DateFrom.HasValue ? DateOnly.FromDateTime(request.DateFrom.Value) : (DateOnly?)null;
            var to = request.DateTo.HasValue ? DateOnly.FromDateTime(request.DateTo.Value) : (DateOnly?)null;

            if (from.HasValue)
            {
                query = query.Where(r => r.PickedUpDate!.Value >= from.Value);
            }

            if (to.HasValue)
            {
                query = query.Where(r => r.PickedUpDate!.Value <= to.Value);
            }

            var completed = await query
                .Select(r => new { r.PickedUpDate, r.Cost })
                .ToListAsync(cancellationToken);

            var points = new List<ChartPointVM>();

            if (request.Granularity == ChartGranularity.Day && from.HasValue && to.HasValue)
            {
                for (var d = from.Value; d <= to.Value; d = d.AddDays(1))
                {
                    var value = completed.Where(r => r.PickedUpDate!.Value == d).Sum(r => r.Cost);
                    points.Add(new ChartPointVM { Label = $"{d.Month}/{d.Day}", Value = value });
                }
            }
            else if (request.Granularity == ChartGranularity.Month && from.HasValue && to.HasValue)
            {
                var cursor = new DateOnly(from.Value.Year, from.Value.Month, 1);
                var end = new DateOnly(to.Value.Year, to.Value.Month, 1);
                while (cursor <= end)
                {
                    var value = completed
                        .Where(r => r.PickedUpDate!.Value.Year == cursor.Year && r.PickedUpDate.Value.Month == cursor.Month)
                        .Sum(r => r.Cost);
                    points.Add(new ChartPointVM { Label = $"{MonthAbbr[cursor.Month - 1]} {cursor.Year % 100:D2}", Value = value });
                    cursor = cursor.AddMonths(1);
                }
            }
            else
            {
                points = completed
                    .GroupBy(r => r.PickedUpDate!.Value.Year)
                    .OrderBy(g => g.Key)
                    .Select(g => new ChartPointVM { Label = g.Key.ToString(), Value = g.Sum(r => r.Cost) })
                    .ToList();
            }

            return new GenericResponse<List<ChartPointVM>>
            {
                Data = points,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
