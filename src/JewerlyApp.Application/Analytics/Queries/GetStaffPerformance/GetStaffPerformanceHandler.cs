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
            var range = request.ResolveDateRange();

            var salesQuery = _context.Sales
                .AsNoTracking()
                .Include(s => s.CreatedByUser)
                .AsQueryable();

            if (range.StartUtc.HasValue)
            {
                salesQuery = salesQuery.Where(s => s.CreatedDate >= range.StartUtc.Value);
            }

            if (range.EndUtc.HasValue)
            {
                salesQuery = salesQuery.Where(s => s.CreatedDate <= range.EndUtc.Value);
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
