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

namespace JewerlyApp.Application.Dashboard.Queries.GetPosDashboardStats
{
    public class GetPosDashboardStatsHandler : IRequestHandler<GetPosDashboardStatsQuery, GenericResponse<PosDashboardStatsDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetPosDashboardStatsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<PosDashboardStatsDto>> Handle(GetPosDashboardStatsQuery request, CancellationToken cancellationToken)
        {
            var (todayStartUtc, todayEndUtc) = BusinessTimeZoneHelper.GetUtcBoundsForEdmontonDate(BusinessTimeZoneHelper.GetEdmontonDate());

            var cashTransactions = await _context.CashTransactions
                .AsNoTracking()
                .Where(t => t.BoxType == CashBoxType.Store)
                .Select(t => new { t.Type, t.Amount, t.CreatedDate })
                .ToListAsync(cancellationToken);

            var storeBalance = cashTransactions.Sum(t => CashTransactionTypeHelper.SignedAmount(t.Type, t.Amount));

            var storeTodayIn = cashTransactions
                .Where(t => CashTransactionTypeHelper.IsCredit(t.Type)
                    && t.CreatedDate.HasValue && t.CreatedDate.Value >= todayStartUtc && t.CreatedDate.Value <= todayEndUtc)
                .Sum(t => t.Amount);

            var storeTodayOut = cashTransactions
                .Where(t => !CashTransactionTypeHelper.IsCredit(t.Type)
                    && t.CreatedDate.HasValue && t.CreatedDate.Value >= todayStartUtc && t.CreatedDate.Value <= todayEndUtc)
                .Sum(t => t.Amount);

            var pools = await UsedGoldPoolCalculator.GetPoolsAsync(_context, cancellationToken);
            var goldWeight = pools.Sum(p => p.Value.Weight);
            var goldValue = pools.Sum(p => p.Value.Cost);
            var goldAverageKarat = goldWeight > 0
                ? pools.Sum(p => p.Key * p.Value.Weight) / goldWeight
                : 0;

            var dto = new PosDashboardStatsDto
            {
                StoreCashBalance = storeBalance,
                StoreCashTodayDelta = storeTodayIn - storeTodayOut,
                UsedGoldWeight = goldWeight,
                UsedGoldAverageKarat = goldAverageKarat,
                UsedGoldValue = goldValue,
            };

            return GenericResponse<PosDashboardStatsDto>.Success(dto);
        }
    }
}
