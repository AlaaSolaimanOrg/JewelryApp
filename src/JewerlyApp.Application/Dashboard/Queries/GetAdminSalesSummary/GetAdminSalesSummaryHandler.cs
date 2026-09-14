using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Dashboard.Dtos;
using JewerlyApp.Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Dashboard.Queries.GetAdminSalesSummary
{
    public class GetAdminSalesSummaryHandler : IRequestHandler<GetAdminSalesSummaryQuery, GenericResponse<AdminSalesSummaryDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetAdminSalesSummaryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<AdminSalesSummaryDto>> Handle(GetAdminSalesSummaryQuery request, CancellationToken cancellationToken)
        {
            var todayDate = BusinessTimeZoneHelper.GetEdmontonDate();
            var yesterdayDate = todayDate.AddDays(-1);
            var trendStartDate = todayDate.AddDays(-13);

            var (todayStartUtc, todayEndUtc) = BusinessTimeZoneHelper.GetUtcBoundsForEdmontonDate(todayDate);
            var (yesterdayStartUtc, yesterdayEndUtc) = BusinessTimeZoneHelper.GetUtcBoundsForEdmontonDate(yesterdayDate);
            var (trendStartUtc, _) = BusinessTimeZoneHelper.GetUtcBoundsForEdmontonDate(trendStartDate);

            var salesInRange = await _context.Sales
                .AsNoTracking()
                .Where(s => s.CreatedDate.HasValue && s.CreatedDate.Value >= trendStartUtc && s.CreatedDate.Value <= todayEndUtc)
                .Select(s => new
                {
                    s.CreatedDate,
                    s.Total,
                    s.Discount,
                    s.CashAmount,
                    s.CardAmount,
                    Items = s.SaleItems.Select(si => new { si.KaratType, si.Weight, si.Quantity, Category = si.Product!.Category }).ToList()
                })
                .ToListAsync(cancellationToken);

            var todaySales = salesInRange
                .Where(s => s.CreatedDate!.Value >= todayStartUtc && s.CreatedDate.Value <= todayEndUtc)
                .ToList();

            var yesterdaySales = salesInRange
                .Where(s => s.CreatedDate!.Value >= yesterdayStartUtc && s.CreatedDate.Value <= yesterdayEndUtc)
                .ToList();

            // ---- Today's sales revenue ----
            var todayRevenue = todaySales.Sum(s => s.Total);
            var todayTransactions = todaySales.Count;
            var yesterdayRevenue = yesterdaySales.Sum(s => s.Total);

            decimal changePercentage;
            bool isIncrease;
            if (yesterdayRevenue == 0)
            {
                changePercentage = todayRevenue > 0 ? 100 : 0;
                isIncrease = todayRevenue >= 0;
            }
            else
            {
                changePercentage = Math.Round((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100, 1);
                isIncrease = todayRevenue >= yesterdayRevenue;
            }

            var salesRevenue = new SalesRevenueDto
            {
                Amount = todayRevenue,
                Transactions = todayTransactions,
                ChangePercentage = changePercentage,
                IsIncrease = isIncrease,
            };

            // ---- Sales trend (last 14 days) ----
            var revenueByDate = salesInRange
                .GroupBy(s => DateOnly.FromDateTime(BusinessTimeZoneHelper.ConvertUtcToEdmonton(s.CreatedDate!.Value)))
                .ToDictionary(g => g.Key, g => g.Sum(s => s.Total));

            var salesTrend = Enumerable.Range(0, 14)
                .Select(offset => trendStartDate.AddDays(offset))
                .Select(d => new TrendPointDto
                {
                    Label = d == todayDate ? "Today" : d.ToString("MMM d"),
                    Value = revenueByDate.TryGetValue(d, out var v) ? v : 0,
                })
                .ToList();

            // ---- Today's payments ----
            var cashToday = todaySales.Sum(s => s.CashAmount ?? 0);
            var cardToday = todaySales.Sum(s => s.CardAmount ?? 0);
            var paymentsTotal = cashToday + cardToday;

            var customersCount = await _context.Customers.CountAsync(c => c.IsActive, cancellationToken);
            var customersAddedToday = await _context.Customers.CountAsync(
                c => c.IsActive && c.CreatedDate.HasValue && c.CreatedDate.Value >= todayStartUtc && c.CreatedDate.Value <= todayEndUtc,
                cancellationToken);

            var payments = new SalesPaymentsDto
            {
                Total = paymentsTotal,
                Cash = new PaymentSplitDto
                {
                    Amount = cashToday,
                    Percentage = paymentsTotal > 0 ? Math.Round(cashToday / paymentsTotal * 100, 1) : 0,
                },
                Card = new PaymentSplitDto
                {
                    Amount = cardToday,
                    Percentage = paymentsTotal > 0 ? Math.Round(cardToday / paymentsTotal * 100, 1) : 0,
                },
                ItemsSold = todaySales.Sum(s => s.Items.Sum(i => i.Quantity)),
                ItemsSoldWeight = todaySales.Sum(s => s.Items.Sum(i => i.Weight * i.Quantity)),
                Discounts = todaySales.Sum(s => s.Discount ?? 0),
                DiscountedSalesCount = todaySales.Count(s => (s.Discount ?? 0) > 0),
                AvgSale = todayTransactions > 0 ? todayRevenue / todayTransactions : 0,
                Customers = customersCount,
                CustomersAddedToday = customersAddedToday,
            };

            // ---- Gold sold today (by karat, % of total weight sold today) ----
            var goldGroups = todaySales
                .SelectMany(s => s.Items)
                .GroupBy(i => (int)i.KaratType)
                .Select(g => new { Karat = g.Key, Weight = g.Sum(i => i.Weight * i.Quantity) })
                .OrderByDescending(g => g.Karat)
                .ToList();

            var totalGoldWeightSoldToday = goldGroups.Sum(g => g.Weight);
            var goldSoldToday = goldGroups
                .Select(g => new GoldByKaratDto
                {
                    Karat = g.Karat,
                    Weight = g.Weight,
                    Percentage = totalGoldWeightSoldToday > 0 ? Math.Round(g.Weight / totalGoldWeightSoldToday * 100, 1) : 0,
                })
                .ToList();

            // ---- Top category (today) ----
            var topCategoryGroup = todaySales
                .SelectMany(s => s.Items)
                .Where(i => i.Category.HasValue)
                .GroupBy(i => i.Category!.Value)
                .Select(g => new { Category = g.Key, ItemsSold = g.Sum(i => i.Quantity) })
                .OrderByDescending(g => g.ItemsSold)
                .FirstOrDefault();

            var topCategory = new TopCategoryDto
            {
                Name = topCategoryGroup != null ? topCategoryGroup.Category.ToString() : "—",
                ItemsSold = topCategoryGroup?.ItemsSold ?? 0,
            };

            var dto = new AdminSalesSummaryDto
            {
                SalesRevenue = salesRevenue,
                SalesTrend = salesTrend,
                Payments = payments,
                GoldSoldToday = goldSoldToday,
                TopCategory = topCategory,
            };

            return GenericResponse<AdminSalesSummaryDto>.Success(dto);
        }
    }
}
