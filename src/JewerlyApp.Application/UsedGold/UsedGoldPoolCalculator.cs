using JewerlyApp.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.UsedGold
{
    public class GoldPoolBalance
    {
        public decimal Weight { get; set; }
        public decimal Cost { get; set; }
        public decimal TotalInvested { get; set; }
    }

    public static class UsedGoldPoolCalculator
    {
        public static async Task<Dictionary<int, GoldPoolBalance>> GetPoolsAsync(
            IApplicationDbContext context, CancellationToken cancellationToken, DateTime? asOfUtc = null)
        {
            var purchased = await context.UsedGoldPurchaseItems
                .Where(i => asOfUtc == null || i.CreatedDate <= asOfUtc)
                .GroupBy(i => i.Karat)
                .Select(g => new { Karat = g.Key, Weight = g.Sum(i => i.Weight), Cost = g.Sum(i => i.Subtotal) })
                .ToListAsync(cancellationToken);

            var melted = await context.UsedGoldMeltBatchItems
                .Where(i => asOfUtc == null || i.CreatedDate <= asOfUtc)
                .GroupBy(i => i.Karat)
                .Select(g => new { Karat = g.Key, Weight = g.Sum(i => i.Weight), Cost = g.Sum(i => i.Cost) })
                .ToListAsync(cancellationToken);

            var returned = await context.UsedGoldStockReturns
                .Where(r => asOfUtc == null || r.CreatedDate <= asOfUtc)
                .GroupBy(r => r.Karat)
                .Select(g => new { Karat = g.Key, Weight = g.Sum(r => r.Weight), Cost = g.Sum(r => r.Cost) })
                .ToListAsync(cancellationToken);

            var pools = new Dictionary<int, GoldPoolBalance>();

            foreach (var p in purchased)
            {
                pools[p.Karat] = new GoldPoolBalance
                {
                    Weight = p.Weight,
                    Cost = p.Cost,
                    TotalInvested = p.Cost,
                };
            }

            foreach (var m in melted)
            {
                if (!pools.TryGetValue(m.Karat, out var pool))
                {
                    pool = new GoldPoolBalance();
                    pools[m.Karat] = pool;
                }
                pool.Weight -= m.Weight;
                pool.Cost -= m.Cost;
            }

            foreach (var r in returned)
            {
                if (!pools.TryGetValue(r.Karat, out var pool))
                {
                    pool = new GoldPoolBalance();
                    pools[r.Karat] = pool;
                }
                pool.Weight -= r.Weight;
                pool.Cost -= r.Cost;
            }

            return pools;
        }
    }
}
