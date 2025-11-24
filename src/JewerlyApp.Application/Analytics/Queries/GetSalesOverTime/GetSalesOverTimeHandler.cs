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
            // 1. Start with range from ReportType
            var (dateFrom, dateTo) = DateRangeHelper.GetDateRange(request.ReportType);

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

            List<SalesOverTimeVM> result;

            switch (request.ReportType)
            {
                case ReportType.Daily:
                    // Group by Hour for the specific day
                    result = salesData
                        .GroupBy(s => s.CreatedDate.Hour)
                        .Select(g => new SalesOverTimeVM
                        {
                            Date = dateFrom.Date.AddHours(g.Key),
                            DateLabel = dateFrom.Date.AddHours(g.Key).ToString("h tt", CultureInfo.InvariantCulture),
                            Revenue = g.Sum(x => x.Total),
                            UnitsSold = g.Sum(x => x.ItemsCount)
                        })
                        .OrderBy(x => x.Date)
                        .ToList();
                    break;

                case ReportType.Weekly:
                    // Group by Day for the week
                    result = salesData
                        .GroupBy(s => s.CreatedDate.Date)
                        .Select(g => new SalesOverTimeVM
                        {
                            Date = g.Key,
                            DateLabel = g.Key.ToString("ddd dd", CultureInfo.InvariantCulture),
                            Revenue = g.Sum(x => x.Total),
                            UnitsSold = g.Sum(x => x.ItemsCount)
                        })
                        .OrderBy(x => x.Date)
                        .ToList();
                    break;

                case ReportType.Monthly:
                    // Group by Day for the month
                    result = salesData
                        .GroupBy(s => s.CreatedDate.Date)
                        .Select(g => new SalesOverTimeVM
                        {
                            Date = g.Key,
                            DateLabel = g.Key.ToString("MMM dd", CultureInfo.InvariantCulture),
                            Revenue = g.Sum(x => x.Total),
                            UnitsSold = g.Sum(x => x.ItemsCount)
                        })
                        .OrderBy(x => x.Date)
                        .ToList();
                    break;

                case ReportType.Yearly:
                    // Group by Month for the year
                    result = salesData
                        .GroupBy(s => new { s.CreatedDate.Year, s.CreatedDate.Month })
                        .Select(g => new SalesOverTimeVM
                        {
                            Date = new DateTime(g.Key.Year, g.Key.Month, 1),
                            DateLabel = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy", CultureInfo.InvariantCulture),
                            Revenue = g.Sum(x => x.Total),
                            UnitsSold = g.Sum(x => x.ItemsCount)
                        })
                        .OrderBy(x => x.Date)
                        .ToList();
                    break;

                default:
                    // Default to Daily grouping
                    result = salesData
                        .GroupBy(s => s.CreatedDate.Date)
                        .Select(g => new SalesOverTimeVM
                        {
                            Date = g.Key,
                            DateLabel = g.Key.ToString("MMM dd", CultureInfo.InvariantCulture),
                            Revenue = g.Sum(x => x.Total),
                            UnitsSold = g.Sum(x => x.ItemsCount)
                        })
                        .OrderBy(x => x.Date)
                        .ToList();
                    break;
            }

            return new GenericResponse<List<SalesOverTimeVM>>
            {
                Data = result,
                StatusCode = Domain.Enums.ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
