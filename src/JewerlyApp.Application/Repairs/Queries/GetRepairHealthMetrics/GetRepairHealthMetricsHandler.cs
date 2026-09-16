using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairHealthMetrics
{
    public class GetRepairHealthMetricsHandler : IRequestHandler<GetRepairHealthMetricsQuery, GenericResponse<RepairHealthMetricsVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetRepairHealthMetricsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<RepairHealthMetricsVM>> Handle(GetRepairHealthMetricsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Repairs.AsQueryable();

            if (request.DateFrom.HasValue)
            {
                var from = DateOnly.FromDateTime(request.DateFrom.Value);
                query = query.Where(r => r.OrderDate >= from);
            }

            if (request.DateTo.HasValue)
            {
                var to = DateOnly.FromDateTime(request.DateTo.Value);
                query = query.Where(r => r.OrderDate <= to);
            }

            var data = await query
                .Select(r => new { r.Status, r.PaymentStatus, r.DueDate, r.PickedUpDate })
                .ToListAsync(cancellationToken);

            var completed = data.Where(r => r.Status == RepairStatus.PickedUp).ToList();
            var cancelled = data.Where(r => r.Status == RepairStatus.Cancelled).ToList();

            var onTime = completed.Count(r =>
                r.PickedUpDate.HasValue && (!r.DueDate.HasValue || r.PickedUpDate.Value <= r.DueDate.Value));

            var vm = new RepairHealthMetricsVM
            {
                OnTimeRate = completed.Count > 0 ? (int)Math.Round(onTime * 100m / completed.Count) : 0,
                OnTimeCount = onTime,
                CollectRate = completed.Count > 0
                    ? (int)Math.Round(completed.Count(r => r.PaymentStatus == PaymentStatus.Paid) * 100m / completed.Count)
                    : 0,
                CancelRate = data.Count > 0 ? (int)Math.Round(cancelled.Count * 100m / data.Count) : 0,
                CancelCount = cancelled.Count,
                CompletedCount = completed.Count,
                TotalCount = data.Count,
            };

            return new GenericResponse<RepairHealthMetricsVM>
            {
                Data = vm,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
