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
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetDashboardInsights
{
    internal class GetDashboardInsightsHandler : IRequestHandler<GetDashboardInsightsQuery, GenericResponse<GetDashboardInsightsVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetDashboardInsightsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<GetDashboardInsightsVM>> Handle(GetDashboardInsightsQuery request, CancellationToken cancellationToken)
        {
            var targetDate = DateTime.Today;
            var yesterday = targetDate.AddDays(-1);
            var lastWeek = targetDate.AddDays(-7);
            var lastMonth = targetDate.AddMonths(-1);

            var result = new GetDashboardInsightsVM();

            // Sales Today vs Yesterday
            var salesToday = await GetSalesForDate(targetDate);
            var salesYesterday = await GetSalesForDate(yesterday);
            result.SalesToday = new SalesTodayDto
            {
                Amount = salesToday,
                ChangePercentage = salesYesterday > 0 ? ((salesToday - salesYesterday) / salesYesterday) * 100 : 0,
                IsIncrease = salesToday > salesYesterday
            };

            // Stock Value vs Last Month
            var currentStockValue = await GetCurrentStockValue(cancellationToken);
            result.StockValue = currentStockValue;

            // Customers (Total vs Last Week)
            var currentCustomers = await GetTotalCustomers();
            var previousCustomers = await GetCustomersCountBeforeDate(lastWeek, cancellationToken);
            result.Customers = new CustomersDto
            {
                Count = currentCustomers,
                ChangePercentage = previousCustomers > 0 ? ((currentCustomers - previousCustomers) / (decimal)previousCustomers) * 100 : 0,
                IsIncrease = currentCustomers > previousCustomers
            };

            // Items Sold Today vs Yesterday
            var itemsSoldToday = await GetItemsSoldForDate(targetDate);
            var itemsSoldYesterday = await GetItemsSoldForDate(yesterday);
            result.ItemsSold = new ItemsSoldDto
            {
                Count = itemsSoldToday,
                ChangePercentage = itemsSoldYesterday > 0 ? ((itemsSoldToday - itemsSoldYesterday) / (decimal)itemsSoldYesterday) * 100 : 0,
                IsIncrease = itemsSoldToday > itemsSoldYesterday
            };

            // Stock Weight by Karat
            result.StockWeightByKarat = await GetStockWeightByKarat();

            return new GenericResponse<GetDashboardInsightsVM>
            {
                Data = result,
                StatusCode = Domain.Enums.ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }

        private async Task<decimal> GetSalesForDate(DateTime date)
        {
            var startDate = date.Date;
            var endDate = date.Date.AddDays(1).AddTicks(-1);

            return await _context.Sales
                .Where(s => s.CreatedDate >= startDate && s.CreatedDate <= endDate)
                .SumAsync(s => s.Total);
        }

        private async Task<decimal> GetCurrentStockValue(CancellationToken cancellationToken)
        {
            // Fixed: Account for quantity in stock value calculation
            var totalStockValue = await _context.Products
                .Where(p => p.Weight > 0 && p.Quantity > 0)
                .Join(_context.PricingSettings,
                    product => new { KaratType = product.KaratType, ProductType = product.Type },
                    pricing => new { pricing.KaratType, pricing.ProductType },
                    (product, pricing) => new
                    {
                        product.Weight,
                        product.Quantity, // Include quantity
                        pricing.Price
                    })
                .SumAsync(x => x.Weight * x.Price * x.Quantity, cancellationToken); // Multiply by quantity

            return totalStockValue.GetValueOrDefault();
        }

        private async Task<int> GetTotalCustomers()
        {
            return await _context.Customers.CountAsync();
        }

        private async Task<int> GetCustomersCountBeforeDate(DateTime date, CancellationToken cancellationToken)
        {
            return await _context.Customers
                .Where(c => c.CreatedDate < date)
                .CountAsync(cancellationToken);
        }

        private async Task<int> GetItemsSoldForDate(DateTime date)
        {
            var startDate = date.Date;
            var endDate = date.Date.AddDays(1).AddTicks(-1);

            // Fixed: Sum the quantities sold instead of counting rows
            return await _context.SaleItems
                .Include(si => si.Sale)
                .Where(si => si.Sale!.CreatedDate >= startDate && si.Sale.CreatedDate <= endDate)
                .SumAsync(si => si.Quantity); // Sum quantities instead of counting rows
        }

        private async Task<List<StockWeightByKaratDto>> GetStockWeightByKarat()
        {
            // Fixed: Account for quantity in weight calculation
            return await _context.Products
                .Where(p => p.Weight > 0 && p.Quantity > 0)
                .GroupBy(p => p.KaratType)
                .Select(g => new StockWeightByKaratDto
                {
                    KaratType = g.Key,
                    Weight = g.Sum(p => p.Weight * p.Quantity).GetValueOrDefault()  // Multiply weight by quantity
                })
                .ToListAsync();
        }
    }
}