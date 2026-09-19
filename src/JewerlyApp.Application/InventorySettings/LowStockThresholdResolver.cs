using JewerlyApp.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.InventorySettings
{
    public static class LowStockThresholdResolver
    {
        public const int DefaultThreshold = 10;

        public static async Task<int> GetCurrentThresholdAsync(IApplicationDbContext context, CancellationToken cancellationToken)
        {
            var setting = await context.InventorySettings.AsNoTracking().FirstOrDefaultAsync(cancellationToken);
            return setting?.LowStockThreshold ?? DefaultThreshold;
        }
    }
}
