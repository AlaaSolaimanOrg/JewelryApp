using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Customers.Queries.GetCustomerTiers
{
    public class GetCustomerTiersHandler : IRequestHandler<GetCustomerTiersQuery, GenericResponse<List<CustomerTierVM>>>
    {
        private const int MembersPerTier = 10;

        private static readonly (string Name, string MinLabel, decimal Min)[] TierDefs =
        {
            ("VIP", "$100K+", 100_000m),
            ("GOLD", "$50K+", 50_000m),
            ("SILVER", "$25K+", 25_000m),
            ("BRONZE", "$8K+", 8_000m),
            ("REGULAR", "under $8K", 0m),
        };

        private readonly IApplicationDbContext _context;

        public GetCustomerTiersHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<CustomerTierVM>>> Handle(GetCustomerTiersQuery request, CancellationToken cancellationToken)
        {
            var vipMin = TierDefs[0].Min;
            var goldMin = TierDefs[1].Min;
            var silverMin = TierDefs[2].Min;
            var bronzeMin = TierDefs[3].Min;
            var regularIndex = TierDefs.Length - 1;

            var tierTotals = await _context.Sales
                .Where(s => s.Customer!.IsActive)
                .GroupBy(s => s.CustomerId)
                .Select(g => new { Spent = g.Sum(s => s.Total) })
                .Select(x => new
                {
                    Tier = x.Spent >= vipMin ? 0 : x.Spent >= goldMin ? 1 : x.Spent >= silverMin ? 2 : x.Spent >= bronzeMin ? 3 : 4,
                    x.Spent,
                })
                .GroupBy(x => x.Tier)
                .Select(g => new { Tier = g.Key, Count = g.Count(), Total = g.Sum(x => x.Spent) })
                .ToDictionaryAsync(g => g.Tier, cancellationToken);

            var customersWithoutSales = await _context.Customers
                .CountAsync(c => c.IsActive && !_context.Sales.Any(s => s.CustomerId == c.Id), cancellationToken);

            var spends = _context.Customers
                .Where(c => c.IsActive)
                .Select(c => new
                {
                    c.Name,
                    Spent = _context.Sales.Where(s => s.CustomerId == c.Id).Sum(s => (decimal?)s.Total) ?? 0m,
                    Purchases = _context.Sales.Count(s => s.CustomerId == c.Id),
                });

            var membersQuery = TierDefs
                .Select((def, index) =>
                {
                    var min = def.Min;
                    var tierSpends = spends.Where(x => x.Spent >= min);

                    if (index > 0)
                    {
                        var max = TierDefs[index - 1].Min;
                        tierSpends = tierSpends.Where(x => x.Spent < max);
                    }

                    return tierSpends
                        .OrderByDescending(x => x.Spent)
                        .Take(MembersPerTier)
                        .Select(x => new { Tier = index, x.Name, x.Spent, x.Purchases });
                })
                .Aggregate((current, next) => current.Concat(next));

            var members = await membersQuery.ToListAsync(cancellationToken);

            var result = TierDefs.Select((def, index) =>
            {
                tierTotals.TryGetValue(index, out var totals);

                return new CustomerTierVM
                {
                    Name = def.Name,
                    MinLabel = def.MinLabel,
                    Count = (totals?.Count ?? 0) + (index == regularIndex ? customersWithoutSales : 0),
                    Total = totals?.Total ?? 0m,
                    Members = members
                        .Where(m => m.Tier == index)
                        .OrderByDescending(m => m.Spent)
                        .Select(m => new TierMemberVM { Name = m.Name, Spent = m.Spent, Purchases = m.Purchases })
                        .ToList(),
                };
            }).ToList();

            return new GenericResponse<List<CustomerTierVM>>
            {
                Data = result,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
