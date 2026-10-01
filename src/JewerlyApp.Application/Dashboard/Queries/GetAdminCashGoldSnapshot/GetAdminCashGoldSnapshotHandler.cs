using JewerlyApp.Application.CashManagement;
using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Dashboard.Dtos;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.UsedGold;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Dashboard.Queries.GetAdminCashGoldSnapshot
{
    public class GetAdminCashGoldSnapshotHandler : IRequestHandler<GetAdminCashGoldSnapshotQuery, GenericResponse<AdminCashGoldSnapshotDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetAdminCashGoldSnapshotHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<AdminCashGoldSnapshotDto>> Handle(GetAdminCashGoldSnapshotQuery request, CancellationToken cancellationToken)
        {
            var (todayStartUtc, todayEndUtc) = BusinessTimeZoneHelper.GetUtcBoundsForEdmontonDate(BusinessTimeZoneHelper.GetEdmontonDate());

            // ---- Cash boxes (right now) ----
            var cashTransactions = await _context.CashTransactions
                .AsNoTracking()
                .Select(t => new { t.BoxType, t.Type, t.Amount, t.CreatedDate })
                .ToListAsync(cancellationToken);

            decimal Balance(CashBoxType box) => cashTransactions
                .Where(t => t.BoxType == box)
                .Sum(t => CashTransactionTypeHelper.SignedAmount(t.Type, t.Amount));

            decimal TodayIn(CashBoxType box) => cashTransactions
                .Where(t => t.BoxType == box && CashTransactionTypeHelper.IsCredit(t.Type)
                    && t.CreatedDate.HasValue && t.CreatedDate.Value >= todayStartUtc && t.CreatedDate.Value <= todayEndUtc)
                .Sum(t => t.Amount);

            decimal TodayOut(CashBoxType box) => cashTransactions
                .Where(t => t.BoxType == box && !CashTransactionTypeHelper.IsCredit(t.Type)
                    && t.CreatedDate.HasValue && t.CreatedDate.Value >= todayStartUtc && t.CreatedDate.Value <= todayEndUtc)
                .Sum(t => t.Amount);

            var storeCash = new StoreCashDto
            {
                Amount = Balance(CashBoxType.Store),
                CashIn = TodayIn(CashBoxType.Store),
                CashOut = TodayOut(CashBoxType.Store),
            };

            var transfersBox = new TransfersBoxDto
            {
                Amount = Balance(CashBoxType.Transfers),
                TodayIn = TodayIn(CashBoxType.Transfers),
            };

            // ---- Used gold on hand ----
            var pools = await UsedGoldPoolCalculator.GetPoolsAsync(_context, cancellationToken);
            var goldWeightOnHand = pools.Sum(p => p.Value.Weight);
            var goldInvestedValue = pools.Sum(p => p.Value.Cost);
            var goldAverageKarat = goldWeightOnHand > 0
                ? pools.Sum(p => p.Key * p.Value.Weight) / goldWeightOnHand
                : 0;

            var usedGoldOnHand = new UsedGoldOnHandDto
            {
                Weight = goldWeightOnHand,
                AvgKarat = goldAverageKarat,
                InvestedValue = goldInvestedValue,
            };

            // ---- Used gold bought (today) ----
            var usedGoldToday = await _context.UsedGoldPurchases
                .AsNoTracking()
                .Where(p => p.CreatedDate.HasValue && p.CreatedDate.Value >= todayStartUtc && p.CreatedDate.Value <= todayEndUtc)
                .Select(p => new { p.TotalAmount, p.TotalWeight })
                .ToListAsync(cancellationToken);

            var usedGoldBought = new UsedGoldBoughtDto
            {
                Amount = usedGoldToday.Sum(p => p.TotalAmount),
                Weight = usedGoldToday.Sum(p => p.TotalWeight),
                Purchases = usedGoldToday.Count,
            };

            var dto = new AdminCashGoldSnapshotDto
            {
                StoreCash = storeCash,
                TransfersBox = transfersBox,
                UsedGoldOnHand = usedGoldOnHand,
                UsedGoldBought = usedGoldBought,
            };

            return GenericResponse<AdminCashGoldSnapshotDto>.Success(dto);
        }
    }
}
