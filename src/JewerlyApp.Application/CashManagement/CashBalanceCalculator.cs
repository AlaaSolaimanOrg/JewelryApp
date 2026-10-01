using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;

namespace JewerlyApp.Application.CashManagement
{
    public static class CashBalanceCalculator
    {
        public static async Task<decimal> GetBalanceAsync(IApplicationDbContext context, CashBoxType boxType, CancellationToken cancellationToken)
        {
            var transactions = await context.CashTransactions
                .Where(t => t.BoxType == boxType)
                .Select(t => new { t.Type, t.Amount })
                .ToListAsync(cancellationToken);

            return transactions.Sum(t => CashTransactionTypeHelper.SignedAmount(t.Type, t.Amount));
        }
    }
}
