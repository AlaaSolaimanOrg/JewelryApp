using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Dashboard.Dtos;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Dashboard.Queries.GetAdminRepairsStats
{
    public class GetAdminRepairsStatsHandler : IRequestHandler<GetAdminRepairsStatsQuery, GenericResponse<AdminRepairsStatsDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetAdminRepairsStatsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<AdminRepairsStatsDto>> Handle(GetAdminRepairsStatsQuery request, CancellationToken cancellationToken)
        {
            var todayDate = BusinessTimeZoneHelper.GetEdmontonDate();

            var repairs = await _context.Repairs
                .AsNoTracking()
                .Select(r => new
                {
                    r.Status,
                    r.PaymentStatus,
                    r.Cost,
                    r.OrderDate,
                    r.DueDate,
                    r.Notified,
                    r.PaidDate,
                })
                .ToListAsync(cancellationToken);

            var repairsPaidToday = repairs
                .Where(r => r.PaymentStatus == PaymentStatus.Paid
                    && r.PaidDate == todayDate)
                .ToList();

            var repairsCollected = new RepairsCollectedDto
            {
                Amount = repairsPaidToday.Sum(r => r.Cost),
                Payments = repairsPaidToday.Count,
                RepairsTakenIn = repairs.Count(r => r.OrderDate == todayDate),
            };

            var unpaidRepairs = repairs.Where(r => r.PaymentStatus == PaymentStatus.Unpaid).ToList();

            var repairsCounts = new RepairsCountsDto
            {
                InProgress = repairs.Count(r => r.Status == RepairStatus.InProgress),
                AwaitingCall = repairs.Count(r => r.Status == RepairStatus.Completed && !r.Notified),
                DueToday = repairs.Count(r => r.Status == RepairStatus.InProgress && r.DueDate == todayDate),
                Overdue = repairs.Count(r => r.Status == RepairStatus.InProgress && r.DueDate.HasValue && r.DueDate.Value < todayDate),
                UnpaidBalance = unpaidRepairs.Sum(r => r.Cost),
                UnpaidCount = unpaidRepairs.Count,
            };

            var dto = new AdminRepairsStatsDto
            {
                RepairsCollected = repairsCollected,
                Repairs = repairsCounts,
            };

            return GenericResponse<AdminRepairsStatsDto>.Success(dto);
        }
    }
}
