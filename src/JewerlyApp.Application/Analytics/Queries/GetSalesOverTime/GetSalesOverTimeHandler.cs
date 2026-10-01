using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Domain.Enums;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Analytics.Queries.GetSalesOverTime
{
    public class GetSalesOverTimeHandler : IRequestHandler<GetSalesOverTimeQuery, GenericResponse<List<SalesOverTimeVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetSalesOverTimeHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<SalesOverTimeVM>>> Handle(GetSalesOverTimeQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Sales.AsNoTracking().AsQueryable();

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

            // 2. Override with specific dates if provided
            if (request.DateFrom.HasValue) dateFrom = request.DateFrom.Value;
            if (request.DateTo.HasValue) dateTo = request.DateTo.Value;

            query = query.Where(s => s.CreatedDate >= dateFrom && s.CreatedDate <= dateTo);

            var salesData = await query
                .Where(s => s.CreatedDate.HasValue)
                .Select(s => new
                {
                    CreatedDate = s.CreatedDate!.Value,
                    s.Total,
                    ItemsCount = s.SaleItems.Sum(si => si.Quantity)
                })
                .ToListAsync(cancellationToken);

            // Group by business local time, not UTC storage time.
            var salesDataInEdmonton = salesData.Select(s => new
            {
                CreatedDate = BusinessTimeZoneHelper.ConvertUtcToEdmonton(s.CreatedDate),
                s.Total,
                s.ItemsCount
            }).ToList();

            if (salesDataInEdmonton.Count == 0)
            {
                return new GenericResponse<List<SalesOverTimeVM>>
                {
                    Data = new List<SalesOverTimeVM>(),
                    StatusCode = Domain.Enums.ResponseStatusCode.Success,
                    Message = Messages.Success
                };
            }

            var rangeStart = dateFrom == DateTime.MinValue ? salesDataInEdmonton.Min(s => s.CreatedDate) : dateFrom;
            var rangeEnd = dateTo == DateTime.MaxValue ? salesDataInEdmonton.Max(s => s.CreatedDate) : dateTo;
            var spanDays = (rangeEnd - rangeStart).TotalDays;

            Func<DateTime, DateTime> bucketOf;
            string labelFormat;

            if (spanDays <= 1)
            {
                bucketOf = d => d.Date.AddHours(d.Hour);
                labelFormat = "h tt";
            }
            else if (spanDays <= 7)
            {
                bucketOf = d => d.Date;
                labelFormat = "ddd dd";
            }
            else if (spanDays <= 62)
            {
                bucketOf = d => d.Date;
                labelFormat = "MMM dd";
            }
            else if (spanDays <= 184)
            {
                bucketOf = d => d.Date.AddDays(-(((int)d.DayOfWeek + 6) % 7));
                labelFormat = "MMM dd";
            }
            else if (spanDays <= 1096)
            {
                bucketOf = d => new DateTime(d.Year, d.Month, 1);
                labelFormat = "MMM yyyy";
            }
            else
            {
                bucketOf = d => new DateTime(d.Year, 1, 1);
                labelFormat = "yyyy";
            }

            var result = salesDataInEdmonton
                .GroupBy(s => bucketOf(s.CreatedDate))
                .Select(g => new SalesOverTimeVM
                {
                    Date = g.Key,
                    DateLabel = g.Key.ToString(labelFormat, CultureInfo.InvariantCulture),
                    Revenue = g.Sum(x => x.Total),
                    UnitsSold = g.Sum(x => x.ItemsCount)
                })
                .OrderBy(x => x.Date)
                .ToList();

            return new GenericResponse<List<SalesOverTimeVM>>
            {
                Data = result,
                StatusCode = Domain.Enums.ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
