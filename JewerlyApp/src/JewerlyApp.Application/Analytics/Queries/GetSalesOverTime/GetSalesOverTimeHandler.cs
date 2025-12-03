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
            // Determine date range / filtering strategy
            var hasExplicitDates = request.DateFrom.HasValue || request.DateTo.HasValue;
            var hasReportType = request.ReportType.HasValue;
            var noDateFilter = !hasExplicitDates && !hasReportType; // when true, treat as "all time"

            DateTime dateFrom = DateTime.MinValue;
            DateTime dateTo = DateTime.MaxValue;

            if (hasReportType)
            {
                var (rFrom, rTo) = DateRangeHelper.GetDateRange(request.ReportType!.Value);
                dateFrom = rFrom;
                dateTo = rTo;
            }

            if (request.DateFrom.HasValue) dateFrom = request.DateFrom.Value;
            if (request.DateTo.HasValue) dateTo = request.DateTo.Value;

            var salesQuery = _context.Sales
                .AsNoTracking()
                .AsQueryable();

            if (!noDateFilter)
            {
                salesQuery = salesQuery.Where(s => s.CreatedDate >= dateFrom && s.CreatedDate <= dateTo);
            }

            // Group by day
            var groups = await salesQuery
                .GroupBy(s => s.CreatedDate.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Total = g.Sum(s => s.Total)
                })
                .OrderBy(x => x.Date)
                .ToListAsync(cancellationToken);

            var result = groups.Select(g => new SalesOverTimeVM
            {
                // If SalesOverTimeVM.Period is DateTime, this will match; if it's string, adjust accordingly elsewhere.
                Period = g.Date,
                Sales = g.Total
            }).ToList();

            return new GenericResponse<List<SalesOverTimeVM>>
            {
                Data = result,
                StatusCode = Domain.Enums.ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
