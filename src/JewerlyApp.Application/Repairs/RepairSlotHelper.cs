using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs
{
    public static class RepairSlotHelper
    {
        public static async Task<int?> GetNextAvailableSlotAsync(IApplicationDbContext context, int maxSlots, CancellationToken cancellationToken)
        {
            var occupiedSlots = (await context.Repairs
                .Where(r => r.Status != RepairStatus.PickedUp && r.Status != RepairStatus.Cancelled && r.SlotNumber != null)
                .Select(r => r.SlotNumber!.Value)
                .ToListAsync(cancellationToken))
                .ToHashSet();

            for (int slot = 1; slot <= maxSlots; slot++)
            {
                if (!occupiedSlots.Contains(slot))
                    return slot;
            }

            return null;
        }
    }
}
