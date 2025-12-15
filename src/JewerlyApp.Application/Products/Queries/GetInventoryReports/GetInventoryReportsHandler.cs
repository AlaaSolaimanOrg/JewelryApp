using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Products.Queries.GetInventoryReports;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.InventoryReports.Queries
{
    public class GetInventoryReportsHandler
        : IRequestHandler<GetInventoryReportsQuery, GenericResponse<InventoryReportsVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetInventoryReportsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<InventoryReportsVM>> Handle(
            GetInventoryReportsQuery request,
            CancellationToken cancellationToken)
        {
            /* =========================
               BASE QUERIES
            ========================= */

            IQueryable<Product> productsQuery = _context.Products
                .AsNoTracking()
                .Where(p => !p.IsManualEntry);

            IQueryable<ReturnItem> returnsQuery = _context.ReturnItems
                .AsNoTracking();

            /* =========================
               DATE FILTER
            ========================= */

            if (request.DateFrom.HasValue && request.DateTo.HasValue)
            {
                productsQuery = productsQuery.Where(p =>
                    p.CreatedDate >= request.DateFrom.Value &&
                    p.CreatedDate <= request.DateTo.Value);

                returnsQuery = returnsQuery.Where(r =>
                r.CreatedDate >= request.DateFrom &&
                r.CreatedDate <= request.DateTo);
            }

            /* =========================
               ADDED ITEMS (QUANTITY-AWARE)
            ========================= */

            var added = await productsQuery
                .GroupBy(p => p.KaratType)
                .Select(g => new KaratInventoryReportVM
                {
                    KaratType = g.Key,
                    ItemCount = g.Sum(x => x.Quantity),
                    TotalWeight = g.Sum(x => x.Weight * x.Quantity)
                })
                .ToListAsync(cancellationToken);

            /* =========================
               RETURNED ITEMS (QUANTITY-AWARE)
            ========================= */

            var returned = await returnsQuery
                .GroupBy(r => r.SaleItem.KaratType)
                .Select(g => new KaratInventoryReportVM
                {
                    KaratType = g.Key,
                    ItemCount = g.Sum(x => x.QuantityReturned),
                    TotalWeight = g.Sum(x => x.SaleItem.Weight * x.QuantityReturned)
                })
                .ToListAsync(cancellationToken);

            /* =========================
               NORMALIZE KARATS (18,21,22,24)
            ========================= */

            var allKarats = Enum.GetValues<KaratType>();

            List<KaratInventoryReportVM> Normalize(List<KaratInventoryReportVM> source)
            {
                return allKarats.Select(k =>
                {
                    var existing = source.FirstOrDefault(x => x.KaratType == k);
                    return existing ?? new KaratInventoryReportVM
                    {
                        KaratType = k,
                        ItemCount = 0,
                        TotalWeight = 0
                    };
                }).ToList();
            }

            var result = new InventoryReportsVM
            {
                Added = Normalize(added),
                Returned = Normalize(returned)
            };

            return new GenericResponse<InventoryReportsVM>
            {
                StatusCode = ResponseStatusCode.Success,
                Data = result
            };
        }
    }
}
