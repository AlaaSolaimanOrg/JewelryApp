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
            var query = _context.Sales
                .AsNoTracking()
                .Include(s => s.CreatedByUser)
                .AsQueryable();

            // Apply Date Range
            // 1. Start with range from ReportType
            var (dateFrom, dateTo) = DateRangeHelper.GetDateRange(request.ReportType);

            // 2. Override with specific dates if provided
            if (request.DateFrom.HasValue) dateFrom = request.DateFrom.Value;
            if (request.DateTo.HasValue) dateTo = request.DateTo.Value;

            query = query.Where(s => s.CreatedDate >= dateFrom && s.CreatedDate <= dateTo);

            var staffPerformance = await query
                .Where(s => s.CreatedByUser != null)
                .GroupBy(s => s.CreatedByUser!.FullName ?? s.CreatedByUser.UserName) // Use FullName or UserName as fallback
                .Select(g => new StaffPerformanceVM
                {
                    StaffName = g.Key ?? "Unknown",
                    SalesAmount = g.Sum(s => s.Total),
                    Commission = 0 // Placeholder as per requirements
                })
                .OrderByDescending(x => x.SalesAmount)
                .ToListAsync(cancellationToken);

            return new GenericResponse<List<StaffPerformanceVM>>
            {
                Data = staffPerformance,
                StatusCode = Domain.Enums.ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
