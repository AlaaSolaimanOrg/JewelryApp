using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Sales.Queries.GetSalesInsights;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetTopSellingCategories
{
    internal class GetTopSellingCategoriesHandler : IRequestHandler<GetTopSellingCategoriesQuery, GenericResponse<List<GetTopSellingCategoriesVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetTopSellingCategoriesHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<GetTopSellingCategoriesVM>>> Handle(GetTopSellingCategoriesQuery request, CancellationToken cancellationToken)
        {
            var saleItemsQuery = _context.SaleItems
                .Include(si => si.Product)
                .Include(si => si.Sale)
                .Where(si => si.Quantity > 0)
                .AsQueryable();

            // Apply date range filter
            if (request.DateFrom.HasValue)
            {
                saleItemsQuery = saleItemsQuery.Where(si => si.Sale!.CreatedDate >= request.DateFrom.Value);
            }

            if (request.DateTo.HasValue)
            {
                saleItemsQuery = saleItemsQuery.Where(si => si.Sale!.CreatedDate <= request.DateTo.Value);
            }

            // Apply karat type filter
            if (request.KaratFilter != null)
            {
                saleItemsQuery = saleItemsQuery.Where(si => si.KaratType == request.KaratFilter);
            }

            // Get category sales data
            var categorySales = await saleItemsQuery
                .Where(si => si.Product != null && si.Product.Category != null)
                .GroupBy(si => new
                {
                    Category = si.Product!.Category!,
                    KaratType = si.KaratType
                })
                .Select(g => new
                {
                    Category = g.Key.Category,
                    KaratType = g.Key.KaratType,
                    ItemsSold = g.Sum(si => si.Quantity), // FIXED: Sum quantities instead of counting rows
                    Revenue = g.Sum(si => Math.Round(si.SubTotal -
                                (si.Sale.Discount ?? 0) * (si.SubTotal > 0 ? si.SubTotal / si.Sale.SubTotal : 0), 2)) 

                    
                    // This should already account for quantity, but verify
                })
                .ToListAsync(cancellationToken);

            // Calculate total for percentage
            var totalRevenue = categorySales.Sum(x => x.Revenue);

            // Transform to DTO and calculate percentages
            var topCategories = categorySales
                .Select(x => new GetTopSellingCategoriesVM
                {
                    CategoryName = x.Category.ToString()!,
                    Karat = x.KaratType,
                    ItemsSold = x.ItemsSold,
                    Revenue = x.Revenue,
                    PercentageOfTotal = totalRevenue > 0 ? Math.Round(x.Revenue / totalRevenue, 2) * 100 : 0
                })
                .OrderByDescending(x => x.Revenue) // Primary order by revenue
                .ThenByDescending(x => x.ItemsSold) // Secondary order by items sold
                .Take(request.TopCount ?? 10)
                .ToList();

            return new GenericResponse<List<GetTopSellingCategoriesVM>>
            {
                Data = topCategories,
                StatusCode = Domain.Enums.ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}