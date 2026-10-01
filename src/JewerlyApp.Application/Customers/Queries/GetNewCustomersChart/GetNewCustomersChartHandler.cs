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

namespace JewerlyApp.Application.Customers.Queries.GetNewCustomersChart
{
    public class GetNewCustomersChartHandler : IRequestHandler<GetNewCustomersChartQuery, GenericResponse<List<NewCustomersChartPointVM>>>
    {
        private static readonly string[] MonthAbbr = System.Globalization.CultureInfo.InvariantCulture.DateTimeFormat.AbbreviatedMonthNames;

        private readonly IApplicationDbContext _context;

        public GetNewCustomersChartHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<NewCustomersChartPointVM>>> Handle(GetNewCustomersChartQuery request, CancellationToken cancellationToken)
        {
            // Every customer's first-ever sale date decides which bucket they land in.
            var firstSaleDates = await _context.Sales
                .AsNoTracking()
                .GroupBy(s => s.CustomerId)
                .Select(g => g.Min(s => s.CreatedDate))
                .Where(d => d != null)
                .ToListAsync(cancellationToken);

            var dates = firstSaleDates.Select(d => d!.Value).ToList();

            var from = request.DateFrom.HasValue ? DateOnly.FromDateTime(request.DateFrom.Value) : (DateOnly?)null;
            var to = request.DateTo.HasValue ? DateOnly.FromDateTime(request.DateTo.Value) : (DateOnly?)null;

            if (from.HasValue)
            {
                dates = dates.Where(d => DateOnly.FromDateTime(d) >= from.Value).ToList();
            }

            if (to.HasValue)
            {
                dates = dates.Where(d => DateOnly.FromDateTime(d) <= to.Value).ToList();
            }

            var points = new List<NewCustomersChartPointVM>();

            if (request.Granularity == NewCustomersChartGranularity.Day && from.HasValue && to.HasValue)
            {
                for (var d = from.Value; d <= to.Value; d = d.AddDays(1))
                {
                    var count = dates.Count(x => DateOnly.FromDateTime(x) == d);
                    points.Add(new NewCustomersChartPointVM { Label = $"{d.Month}/{d.Day}", Value = count });
                }
            }
            else if (request.Granularity == NewCustomersChartGranularity.Month && from.HasValue && to.HasValue)
            {
                var cursor = new DateOnly(from.Value.Year, from.Value.Month, 1);
                var end = new DateOnly(to.Value.Year, to.Value.Month, 1);
                while (cursor <= end)
                {
                    var count = dates.Count(x => x.Year == cursor.Year && x.Month == cursor.Month);
                    points.Add(new NewCustomersChartPointVM { Label = $"{MonthAbbr[cursor.Month - 1]} {cursor.Year % 100:D2}", Value = count });
                    cursor = cursor.AddMonths(1);
                }
            }
            else
            {
                points = dates
                    .GroupBy(d => d.Year)
                    .OrderBy(g => g.Key)
                    .Select(g => new NewCustomersChartPointVM { Label = g.Key.ToString(), Value = g.Count() })
                    .ToList();
            }

            return new GenericResponse<List<NewCustomersChartPointVM>>
            {
                Data = points,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
