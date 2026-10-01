using JewerlyApp.Application.CashManagement.Dtos;
using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.CashManagement.Queries.GetCashBalances
{
    public class GetCashBalancesHandler : IRequestHandler<GetCashBalancesQuery, GenericResponse<CashBalancesDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetCashBalancesHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<CashBalancesDto>> Handle(GetCashBalancesQuery request, CancellationToken cancellationToken)
        {
            var (todayStartUtc, todayEndUtc) = BusinessTimeZoneHelper.GetUtcBoundsForEdmontonDate(BusinessTimeZoneHelper.GetEdmontonDate());

            var transactions = await _context.CashTransactions
                .AsNoTracking()
                .Select(t => new { t.BoxType, t.Type, t.Amount, t.CreatedDate })
                .ToListAsync(cancellationToken);

            decimal Balance(CashBoxType box) => transactions
                .Where(t => t.BoxType == box)
                .Sum(t => CashTransactionTypeHelper.SignedAmount(t.Type, t.Amount));

            decimal TodayIn(CashBoxType box) => transactions
                .Where(t => t.BoxType == box && CashTransactionTypeHelper.IsCredit(t.Type)
                    && t.CreatedDate.HasValue && t.CreatedDate.Value >= todayStartUtc && t.CreatedDate.Value <= todayEndUtc)
                .Sum(t => t.Amount);

            decimal TodayOut(CashBoxType box) => transactions
                .Where(t => t.BoxType == box && !CashTransactionTypeHelper.IsCredit(t.Type)
                    && t.CreatedDate.HasValue && t.CreatedDate.Value >= todayStartUtc && t.CreatedDate.Value <= todayEndUtc)
                .Sum(t => t.Amount);

            var dto = new CashBalancesDto
            {
                StoreBalance = Balance(CashBoxType.Store),
                TransferBalance = Balance(CashBoxType.Transfers),
                StoreTodayIn = TodayIn(CashBoxType.Store),
                StoreTodayOut = TodayOut(CashBoxType.Store),
                TransferTodayIn = TodayIn(CashBoxType.Transfers),
                TransferTodayOut = TodayOut(CashBoxType.Transfers),
            };

            return GenericResponse<CashBalancesDto>.Success(dto, Messages.Success);
        }
    }
}
