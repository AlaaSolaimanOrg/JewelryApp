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

namespace JewerlyApp.Application.Analytics.Queries.GetStaffPerformance
{
    public class GetStaffPerformanceHandler : IRequestHandler<GetStaffPerformanceQuery, GenericResponse<List<StaffPerformanceVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetStaffPerformanceHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<StaffPerformanceVM>>> Handle(GetStaffPerformanceQuery request, CancellationToken cancellationToken)
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
                .Include(s => s.CreatedByUser)
                .AsQueryable();

            if (!noDateFilter)
            {
                salesQuery = salesQuery.Where(s => s.CreatedDate >= dateFrom && s.CreatedDate <= dateTo);
            }

            var staffPerformance = await salesQuery
                .Where(s => s.CreatedByUser != null)
                .GroupBy(s => s.CreatedByUser!.FullName ?? s.CreatedByUser.UserName)
                .Select(g => new
                {
                    Name = g.Key,
                    Sales = g.Sum(s => s.Total)
                })
                .OrderByDescending(x => x.Sales)
                .ToListAsync(cancellationToken);

            var result = staffPerformance.Select(s => new StaffPerformanceVM
            {
                StaffName = s.Name,
                SalesAmount = s.Sales
            }).ToList();

            return new GenericResponse<List<StaffPerformanceVM>>
            {
                Data = result,
                StatusCode = Domain.Enums.ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
