using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
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
            var customers = await _context.Customers
                .AsNoTracking()
                .Where(c => c.IsActive)
                .Select(c => new { c.Id, c.Name })
                .ToListAsync(cancellationToken);

            var salesByCustomer = await _context.Sales
                .AsNoTracking()
                .GroupBy(s => s.CustomerId)
                .Select(g => new { CustomerId = g.Key, Total = g.Sum(s => s.Total), Count = g.Count() })
                .ToDictionaryAsync(g => g.CustomerId, cancellationToken);

            var enriched = customers.Select(c =>
            {
                salesByCustomer.TryGetValue(c.Id, out var sales);
                return new
                {
                    c.Id,
                    c.Name,
                    Spent = sales?.Total ?? 0m,
                    Purchases = sales?.Count ?? 0,
                };
            }).ToList();

            var tiers = TierDefs.Select(def =>
            {
                var members = enriched.Where(c => c.Spent >= def.Min).ToList();
                // Each customer belongs to exactly one tier — the highest one they qualify for.
                return (def, members);
            }).ToList();

            var result = new List<CustomerTierVM>();
            var claimed = new HashSet<Guid>();

            foreach (var (def, candidateMembers) in tiers)
            {
                var members = candidateMembers.Where(m => !claimed.Contains(m.Id)).ToList();
                foreach (var m in members) claimed.Add(m.Id);

                result.Add(new CustomerTierVM
                {
                    Name = def.Name,
                    MinLabel = def.MinLabel,
                    Count = members.Count,
                    Total = members.Sum(m => m.Spent),
                    Members = members
                        .OrderByDescending(m => m.Spent)
                        .Take(MembersPerTier)
                        .Select(m => new TierMemberVM { Name = m.Name, Spent = m.Spent, Purchases = m.Purchases })
                        .ToList(),
                });
            }

            return new GenericResponse<List<CustomerTierVM>>
            {
                Data = result,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
