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

namespace JewerlyApp.Application.UsedGold.Queries.GetHistory
{
    public class GetHistoryHandler : IRequestHandler<GetHistoryQuery, PaginatedResponse<UsedGoldHistoryDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetHistoryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResponse<UsedGoldHistoryDto>> Handle(GetHistoryQuery request, CancellationToken cancellationToken)
        {
            var (startUtc, endUtc) = UsedGoldDateRangeHelper.GetRange(request.Period, request.Month, request.Year);

            var entries = new List<UsedGoldHistoryDto>();

            if (string.IsNullOrEmpty(request.TypeFilter) || request.TypeFilter == "purchase")
            {
                var purchaseRows = await _context.UsedGoldPurchaseItems
                    .Include(i => i.Purchase)
                    .Where(i => (startUtc == null || i.CreatedDate >= startUtc) && (endUtc == null || i.CreatedDate <= endUtc))
                    .Select(i => new UsedGoldHistoryDto
                    {
                        Id = i.Id,
                        Date = i.CreatedDate ?? DateTime.UtcNow,
                        Type = "purchase",
                        Desc = i.Purchase.CustomerName,
                        Notes = i.Purchase.Notes,
                        Karat = i.Karat,
                        Weight = i.Weight,
                        Cost = i.Subtotal,
                    })
                    .ToListAsync(cancellationToken);
                entries.AddRange(purchaseRows);
            }

            if (string.IsNullOrEmpty(request.TypeFilter) || request.TypeFilter == "melt")
            {
                var meltRows = await _context.UsedGoldMeltBatches
                    .Where(b => (startUtc == null || b.CreatedDate >= startUtc) && (endUtc == null || b.CreatedDate <= endUtc))
                    .Select(b => new UsedGoldHistoryDto
                    {
                        Id = b.Id,
                        Date = b.CreatedDate ?? DateTime.UtcNow,
                        Type = "melt",
                        Desc = "Melt batch",
                        Notes = b.Notes,
                        Karat = null,
                        Weight = b.TotalWeight,
                        Cost = b.TotalCost,
                    })
                    .ToListAsync(cancellationToken);
                entries.AddRange(meltRows);
            }

            if (string.IsNullOrEmpty(request.TypeFilter) || request.TypeFilter == "stock")
            {
                var stockRows = await _context.UsedGoldStockReturns
                    .Where(r => (startUtc == null || r.CreatedDate >= startUtc) && (endUtc == null || r.CreatedDate <= endUtc))
                    .Select(r => new UsedGoldHistoryDto
                    {
                        Id = r.Id,
                        Date = r.CreatedDate ?? DateTime.UtcNow,
                        Type = "stock",
                        Desc = "Return to stock",
                        Notes = r.Notes,
                        Karat = r.Karat,
                        Weight = r.Weight,
                        Cost = r.Cost,
                    })
                    .ToListAsync(cancellationToken);
                entries.AddRange(stockRows);
            }

            if (!string.IsNullOrWhiteSpace(request.SearchBy))
            {
                var s = request.SearchBy.ToLower();
                entries = entries.Where(e =>
                    e.Desc.ToLower().Contains(s) ||
                    (e.Notes != null && e.Notes.ToLower().Contains(s))).ToList();
            }

            entries = SortEntries(entries, request.SortBy, request.SortDirection);

            int totalRecords = entries.Count;

            var paged = entries
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            return new PaginatedResponse<UsedGoldHistoryDto>
            {
                Data = paged,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = totalRecords,
                StatusCode = totalRecords > 0 ? ResponseStatusCode.Success : ResponseStatusCode.NoContent,
                Message = Messages.Success
            };
        }

        private static List<UsedGoldHistoryDto> SortEntries(List<UsedGoldHistoryDto> entries, string? sortBy, SortDirection direction)
        {
            Func<UsedGoldHistoryDto, object> keySelector = sortBy?.ToLower() switch
            {
                "weight" => e => e.Weight,
                "cost" => e => e.Cost,
                "karat" => e => e.Karat ?? 0,
                "type" => e => e.Type,
                _ => e => e.Date,
            };

            return direction == SortDirection.Ascending
                ? entries.OrderBy(keySelector).ToList()
                : entries.OrderByDescending(keySelector).ToList();
        }
    }
}
