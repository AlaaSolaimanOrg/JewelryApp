using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Sales.Queries.GetSalesList;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetSalesInsights
{
    public class GetSalesInsightsHandler : IRequestHandler<GetSalesInsightsQuery, GenericResponse<GetSalesInsightsVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetSalesInsightsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<GetSalesInsightsVM>> Handle(GetSalesInsightsQuery request, CancellationToken cancellationToken)
        {
            var salesQuery = _context.Sales
            .Include(s => s.SaleItems)
            .AsQueryable();

            // Apply date range filter
            if (request.DateFrom.HasValue)
            {
                salesQuery = salesQuery.Where(s => s.CreatedDate >= request.DateFrom.Value);
            }

            if (request.DateTo.HasValue)
            {
                salesQuery = salesQuery.Where(s => s.CreatedDate <= request.DateTo.Value);
            }

            // Get all data in one query with proper grouping
            var salesData = await salesQuery
                .GroupBy(x => 1) // Single group for totals
                .Select(g => new GetSalesInsightsVM
                {
                    TotalSalesAmount = g.Sum(x => x.Total),
                    CashAmountPaid = g.Sum(x => x.CashAmount ?? 0),
                    CardAmountPaid = g.Sum(x => x.CardAmount ?? 0),
                    DiscountAmount = g.Sum(x => x.Discount ?? 0),
                    TransactionsCount = g.Count(),
                    ItemsSold = g.SelectMany(x => x.SaleItems).Sum(si => si.Quantity),
                    GoldByKarat = g.SelectMany(x => x.SaleItems)
                        .GroupBy(si => si.KaratType)
                        .Select(k => new GoldByKaratVM
                        {
                            KaratType = k.Key,
                            Weight = k.Sum(si => si.Weight * si.Quantity),
                            PricePerGram = k.Average(si => si.OverriddenPricePerGram ?? si.OriginalPricePerGram ?? 0),
                            // itemPrice - (sale discount * itemPrice / total sale price)
                            TotalValue = k.Sum(si => Math.Round(si.SubTotal -
                                     (si.Sale!.Discount ?? 0) * (si.Sale.SubTotal > 0 ? si.SubTotal / si.Sale.SubTotal : 0), 4))
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync(cancellationToken) ?? new GetSalesInsightsVM();

            salesData.AvgSale = salesData.TransactionsCount > 0
                ? salesData.TotalSalesAmount / salesData.TransactionsCount
                : 0;

            var refundsQuery = _context.Returns.AsQueryable();
            if (request.DateFrom.HasValue)
            {
                refundsQuery = refundsQuery.Where(r => r.CreatedDate >= request.DateFrom.Value);
            }
            if (request.DateTo.HasValue)
            {
                refundsQuery = refundsQuery.Where(r => r.CreatedDate <= request.DateTo.Value);
            }
            salesData.RefundAmount = await refundsQuery.SumAsync(r => r.TotalAmount, cancellationToken);

            return new GenericResponse<GetSalesInsightsVM>
            {
                Data = salesData,
                StatusCode = Domain.Enums.ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
