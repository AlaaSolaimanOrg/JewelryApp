using JewerlyApp.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Security
{
    public static class SalesPinResolver
    {
        public const string DefaultPin = "0000";

        public static async Task<string> GetCurrentPinAsync(IApplicationDbContext context, CancellationToken cancellationToken)
        {
            var setting = await context.SecurityPinSettings.FirstOrDefaultAsync(cancellationToken);
            return setting?.Pin ?? DefaultPin;
        }
    }
}
