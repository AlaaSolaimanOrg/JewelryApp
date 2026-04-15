using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs.Queries.GetAnalytics
{
    public class GetRepairAnalyticsHandler : IRequestHandler<GetRepairAnalyticsQuery, GenericResponse<RepairAnalyticsDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetRepairAnalyticsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<RepairAnalyticsDto>> Handle(GetRepairAnalyticsQuery request, CancellationToken cancellationToken)
        {
            var stats = await _context.Repairs
                .GroupBy(x => 1)
                .Select(g => new
                {
                    TotalRepairs = g.Count(),
                    CompletedRepairs = g.Count(r => r.Status == RepairStatus.Completed || r.Status == RepairStatus.PickedUp),
                    PendingRepairs = g.Count(r => r.Status != RepairStatus.Completed && r.Status != RepairStatus.PickedUp),
                    TotalRevenue = g.Sum(r => r.Cost)
                })
                .FirstOrDefaultAsync(cancellationToken);

            var totalRepairs = stats?.TotalRepairs ?? 0;
            var completedRepairs = stats?.CompletedRepairs ?? 0;
            var pendingRepairs = stats?.PendingRepairs ?? 0;
            var totalRevenue = stats?.TotalRevenue ?? 0;

            var completedRepairItems = await _context.Repairs
                .Where(r => (r.Status == RepairStatus.Completed || r.Status == RepairStatus.PickedUp) && r.LastUpdatedDate.HasValue)
                .Select(r => new { r.OrderDate, r.LastUpdatedDate })
                .ToListAsync(cancellationToken);

            double averageDays = 0;
            if (completedRepairItems.Any())
            {
                averageDays = completedRepairItems.Average(r => (r.LastUpdatedDate!.Value.Date - r.OrderDate.ToDateTime(System.TimeOnly.MinValue)).TotalDays);
            }

            var dto = new RepairAnalyticsDto
            {
                TotalRepairs = totalRepairs,
                CompletedRepairs = completedRepairs,
                PendingRepairs = pendingRepairs,
                TotalRevenue = totalRevenue,
                AverageRepairTime = $"{averageDays:F1} days"
            };

            return new GenericResponse<RepairAnalyticsDto>
            {
                Data = dto,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
