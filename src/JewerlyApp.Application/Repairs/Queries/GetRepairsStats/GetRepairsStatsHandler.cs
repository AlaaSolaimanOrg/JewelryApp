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

namespace JewerlyApp.Application.Repairs.Queries.GetRepairsStats
{
    public class GetRepairsStatsHandler : IRequestHandler<GetRepairsStatsQuery, GenericResponse<RepairsStatsVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetRepairsStatsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<RepairsStatsVM>> Handle(GetRepairsStatsQuery request, CancellationToken cancellationToken)
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
                .Select(r => new { r.Status, r.PaymentStatus, r.Cost, r.OrderDate, r.PickedUpDate })
                .ToListAsync(cancellationToken);

            var nonCancelled = data.Where(r => r.Status != RepairStatus.Cancelled).ToList();
            var paid = nonCancelled.Where(r => r.PaymentStatus == PaymentStatus.Paid).ToList();
            var unpaid = data.Where(r => r.PaymentStatus == PaymentStatus.Unpaid && r.Status != RepairStatus.Cancelled).ToList();
            var completed = data.Where(r => r.Status == RepairStatus.PickedUp).ToList();

            var turnarounds = completed
                .Where(r => r.PickedUpDate.HasValue)
                .Select(r => r.PickedUpDate!.Value.DayNumber - r.OrderDate.DayNumber)
                .ToList();

            var vm = new RepairsStatsVM
            {
                RepairCount = nonCancelled.Count,
                TotalRevenue = paid.Sum(r => r.Cost),
                PaidCount = paid.Count,
                TotalAll = nonCancelled.Sum(r => r.Cost),
                UnpaidTotal = unpaid.Sum(r => r.Cost),
                UnpaidCount = unpaid.Count,
                AvgVal = completed.Count > 0 ? completed.Sum(r => r.Cost) / completed.Count : 0,
                AvgTurn = turnarounds.Count > 0 ? turnarounds.Average() : 0,
            };

            return new GenericResponse<RepairsStatsVM>
            {
                Data = vm,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
