using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Analytics.Queries.GetSalesByCategory
{
    public class GetSalesByCategoryHandler : IRequestHandler<GetSalesByCategoryQuery, GenericResponse<List<SalesByCategoryVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetSalesByCategoryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<SalesByCategoryVM>>> Handle(GetSalesByCategoryQuery request, CancellationToken cancellationToken)
        {
            // Determine date range / filtering strategy
            var hasExplicitDates = request.DateFrom.HasValue || request.DateTo.HasValue;
            var hasReportType = request.ReportType.HasValue;
            var noDateFilter = !hasExplicitDates && !hasReportType; // when true, treat as "all time"

            DateTime dateFrom = DateTime.MinValue;
            DateTime dateTo = DateTime.MaxValue;

            if (hasReportType)
            {
                var (rFrom, rTo) = DateRangeHelper.GetDateRange(request.ReportType!.Value);
                dateFrom = rFrom;
                dateTo = rTo;
            }

            if (request.DateFrom.HasValue) dateFrom = request.DateFrom.Value;
            if (request.DateTo.HasValue) dateTo = request.DateTo.Value;

            var saleItemsQuery = _context.SaleItems
                .AsNoTracking()
                .Include(si => si.Product)
                .Include(si => si.Sale)
                .Where(si => si.Product != null && si.Product.Category != null)
                .AsQueryable();

            if (!noDateFilter)
            {
                saleItemsQuery = saleItemsQuery.Where(si => si.Sale!.CreatedDate >= dateFrom && si.Sale.CreatedDate <= dateTo);
            }

            var totalSales = await saleItemsQuery.SumAsync(si => si.SubTotal, cancellationToken);

            var categories = await saleItemsQuery
                .GroupBy(si => si.Product!.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    Revenue = g.Sum(si => si.SubTotal)
                })
                .OrderByDescending(x => x.Revenue)
                .ToListAsync(cancellationToken);

            var result = categories.Select(c => new SalesByCategoryVM
            {
                Category = c.Category.ToString()!,
                Revenue = c.Revenue,
                Percentage = totalSales > 0 ? (c.Revenue / totalSales) * 100 : 0
            }).ToList();

            return new GenericResponse<List<SalesByCategoryVM>>
            {
                Data = result,
                StatusCode = Domain.Enums.ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
