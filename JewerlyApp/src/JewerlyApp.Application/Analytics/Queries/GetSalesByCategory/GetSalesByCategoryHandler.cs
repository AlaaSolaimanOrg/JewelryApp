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
            var query = _context.SaleItems
                .AsNoTracking()
                .Include(si => si.Product)
                .Include(si => si.Sale)
                .AsQueryable();

            // Apply Date Range
            DateTime dateFrom, dateTo;
            if (request.ReportType.HasValue)
            {
                (dateFrom, dateTo) = DateRangeHelper.GetDateRange(request.ReportType.Value);
            }
            else
            {
                // All time
                dateFrom = DateTime.MinValue;
                dateTo = DateTime.MaxValue;
            }

            // 2. Override with specific dates if provided
            if (request.DateFrom.HasValue) dateFrom = request.DateFrom.Value;
            if (request.DateTo.HasValue) dateTo = request.DateTo.Value;

            query = query.Where(si => si.Sale!.CreatedDate >= dateFrom && si.Sale!.CreatedDate <= dateTo);

            var categorySales = await query
                .Where(si => si.Product != null && si.Product.Category != null)
                .GroupBy(si => si.Product!.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    Revenue = g.Sum(si => si.SubTotal)
                })
                .ToListAsync(cancellationToken);

            var totalRevenue = categorySales.Sum(x => x.Revenue);

            var result = categorySales
                .Select(x => new SalesByCategoryVM
                {
                    CategoryName = x.Category.ToString()!,
                    Revenue = x.Revenue,
                    Percentage = totalRevenue > 0 ? (x.Revenue / totalRevenue) * 100 : 0
                })
                .OrderByDescending(x => x.Revenue)
                .ToList();

            return new GenericResponse<List<SalesByCategoryVM>>
            {
                Data = result,
                StatusCode = Domain.Enums.ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
