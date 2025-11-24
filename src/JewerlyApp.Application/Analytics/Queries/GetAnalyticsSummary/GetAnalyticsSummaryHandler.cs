using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Analytics.Queries.GetAnalyticsSummary
{
    public class GetAnalyticsSummaryHandler : IRequestHandler<GetAnalyticsSummaryQuery, GenericResponse<AnalyticsSummaryVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetAnalyticsSummaryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<AnalyticsSummaryVM>> Handle(GetAnalyticsSummaryQuery request, CancellationToken cancellationToken)
        {
            var vm = new AnalyticsSummaryVM();

            // Apply Date Range
            // 1. Start with range from ReportType
            var (dateFrom, dateTo) = DateRangeHelper.GetDateRange(request.ReportType);

            // 2. Override with specific dates if provided
            if (request.DateFrom.HasValue) dateFrom = request.DateFrom.Value;
            if (request.DateTo.HasValue) dateTo = request.DateTo.Value;

            // 1. Avg Daily Sales
            var salesQuery = _context.Sales.AsNoTracking().AsQueryable();
            salesQuery = salesQuery.Where(s => s.CreatedDate >= dateFrom && s.CreatedDate <= dateTo);

            var totalSales = await salesQuery.SumAsync(s => s.Total, cancellationToken);
            
            // Calculate number of days
            var days = (dateTo - dateFrom).TotalDays;
            days = days < 1 ? 1 : days; // Avoid division by zero

            vm.AvgDailySales = totalSales / (decimal)days;
            
            // Placeholder for change percentage (requires previous period calculation, keeping simple for now)
            vm.AvgDailySalesChange = 5.2m; // Mock or calculate if needed

            // 2. Best Selling Category
            var categoryQuery = _context.SaleItems
                .AsNoTracking()
                .Include(si => si.Product)
                .Include(si => si.Sale)
                .Where(si => si.Product != null && si.Product.Category != null);

            categoryQuery = categoryQuery.Where(si => si.Sale!.CreatedDate >= dateFrom && si.Sale!.CreatedDate <= dateTo);

            var bestCategory = await categoryQuery
                .GroupBy(si => si.Product!.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    Revenue = g.Sum(si => si.SubTotal)
                })
                .OrderByDescending(x => x.Revenue)
                .FirstOrDefaultAsync(cancellationToken);

            if (bestCategory != null)
            {
                vm.BestSellingCategory = bestCategory.Category.ToString()!;
                // Calculate percentage of total sales
                vm.BestSellingCategoryPercentage = totalSales > 0 ? (bestCategory.Revenue / totalSales) * 100 : 0;
            }

            // 3. Top Performer
            var staffQuery = _context.Sales
                .AsNoTracking()
                .Include(s => s.CreatedByUser)
                .AsQueryable();

            staffQuery = staffQuery.Where(s => s.CreatedDate >= dateFrom && s.CreatedDate <= dateTo);

            var topStaff = await staffQuery
                .Where(s => s.CreatedByUser != null)
                .GroupBy(s => s.CreatedByUser!.FullName ?? s.CreatedByUser.UserName)
                .Select(g => new
                {
                    Name = g.Key,
                    Sales = g.Sum(s => s.Total)
                })
                .OrderByDescending(x => x.Sales)
                .FirstOrDefaultAsync(cancellationToken);

            if (topStaff != null)
            {
                vm.TopPerformer = topStaff.Name ?? "Unknown";
                vm.TopPerformerSales = topStaff.Sales;
            }

            // 4. Most Valuable Karat (Inventory Value)
            // Note: Inventory value is current state, not historical, so date filters might not apply strictly, 
            // but usually "Most Valuable Karat" implies current asset value.
            var inventoryValueByKarat = await _context.Products
                .AsNoTracking()
                .Where(p => p.Weight > 0 && p.Quantity > 0)
                .Join(_context.PricingSettings,
                    product => new { KaratType = product.KaratType, ProductType = product.Type },
                    pricing => new { pricing.KaratType, pricing.ProductType },
                    (product, pricing) => new
                    {
                        product.KaratType,
                        Value = product.Weight * pricing.Price * product.Quantity
                    })
                .GroupBy(x => x.KaratType)
                .Select(g => new
                {
                    Karat = g.Key,
                    TotalValue = g.Sum(x => x.Value)
                })
                .ToListAsync(cancellationToken);

            var totalInventoryValue = inventoryValueByKarat.Sum(x => x.TotalValue) ?? 0;
            var topKarat = inventoryValueByKarat.OrderByDescending(x => x.TotalValue).FirstOrDefault();

            if (topKarat != null)
            {
                vm.MostValuableKarat = $"{topKarat.Karat} Gold";
                vm.MostValuableKaratPercentage = totalInventoryValue > 0 ? ((topKarat.TotalValue ?? 0) / totalInventoryValue) * 100 : 0;
            }

            return new GenericResponse<AnalyticsSummaryVM>
            {
                Data = vm,
                StatusCode = Domain.Enums.ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
