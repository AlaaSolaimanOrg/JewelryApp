using JewerlyApp.Application.CashManagement;
using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Dashboard.Dtos;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.UsedGold;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Dashboard.Queries.GetAdminDashboardStats
{
    public class GetAdminDashboardStatsHandler : IRequestHandler<GetAdminDashboardStatsQuery, GenericResponse<AdminDashboardStatsDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetAdminDashboardStatsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<AdminDashboardStatsDto>> Handle(GetAdminDashboardStatsQuery request, CancellationToken cancellationToken)
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

            var payments = new AdminDashboardPaymentsDto
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

            // ---- Repairs ----
            var repairs = await _context.Repairs
                .AsNoTracking()
                .Select(r => new
                {
                    r.Status,
                    r.PaymentStatus,
                    r.Cost,
                    r.OrderDate,
                    r.DueDate,
                    r.Notified,
                    r.LastUpdatedDate,
                })
                .ToListAsync(cancellationToken);

            var repairsPaidToday = repairs
                .Where(r => r.PaymentStatus == PaymentStatus.Paid
                    && r.LastUpdatedDate.HasValue
                    && r.LastUpdatedDate.Value >= todayStartUtc && r.LastUpdatedDate.Value <= todayEndUtc)
                .ToList();

            var repairsCollected = new RepairsCollectedDto
            {
                Amount = repairsPaidToday.Sum(r => r.Cost),
                Payments = repairsPaidToday.Count,
                RepairsTakenIn = repairs.Count(r => r.OrderDate == todayDate),
            };

            var awaitingCallCount = repairs.Count(r => r.Status == RepairStatus.Completed && !r.Notified);
            var overdueCount = repairs.Count(r => r.Status == RepairStatus.InProgress && r.DueDate.HasValue && r.DueDate.Value < todayDate);
            var unpaidRepairs = repairs.Where(r => r.PaymentStatus == PaymentStatus.Unpaid).ToList();

            var repairsStats = new AdminDashboardRepairsDto
            {
                InProgress = repairs.Count(r => r.Status == RepairStatus.InProgress),
                AwaitingCall = awaitingCallCount,
                DueToday = repairs.Count(r => r.Status == RepairStatus.InProgress && r.DueDate == todayDate),
                Overdue = overdueCount,
                UnpaidBalance = unpaidRepairs.Sum(r => r.Cost),
                UnpaidCount = unpaidRepairs.Count,
            };

            // ---- Refunds paid out (today) ----
            var returnsToday = await _context.Returns
                .AsNoTracking()
                .Where(r => r.CreatedDate.HasValue && r.CreatedDate.Value >= todayStartUtc && r.CreatedDate.Value <= todayEndUtc)
                .Select(r => new
                {
                    r.TotalAmount,
                    Options = r.Items.Select(i => i.Option).ToList(),
                })
                .ToListAsync(cancellationToken);

            var refundsPaidOut = new RefundsPaidOutDto
            {
                Amount = returnsToday.Sum(r => r.TotalAmount),
                Returns = returnsToday.Count,
                ToStock = returnsToday.Sum(r => r.Options.Count(o => o == ReturnOption.ReturnToStock)),
                ToMelt = returnsToday.Sum(r => r.Options.Count(o => o == ReturnOption.MeltAfterReturn)),
            };

            var needsTagsCount = await _context.ReturnItems
                .AsNoTracking()
                .CountAsync(i => !i.IsTagPrinted && i.Option == ReturnOption.ReturnToStock, cancellationToken);

            // ---- Used gold bought (today) ----
            var usedGoldToday = await _context.UsedGoldPurchases
                .AsNoTracking()
                .Where(p => p.CreatedDate.HasValue && p.CreatedDate.Value >= todayStartUtc && p.CreatedDate.Value <= todayEndUtc)
                .Select(p => new { p.TotalAmount, p.TotalWeight })
                .ToListAsync(cancellationToken);

            var usedGoldBought = new UsedGoldBoughtDto
            {
                Amount = usedGoldToday.Sum(p => p.TotalAmount),
                Weight = usedGoldToday.Sum(p => p.TotalWeight),
                Purchases = usedGoldToday.Count,
            };

            // ---- Cash boxes (right now) ----
            var cashTransactions = await _context.CashTransactions
                .AsNoTracking()
                .Select(t => new { t.BoxType, t.Type, t.Amount, t.CreatedDate })
                .ToListAsync(cancellationToken);

            decimal Balance(CashBoxType box) => cashTransactions
                .Where(t => t.BoxType == box)
                .Sum(t => CashTransactionTypeHelper.SignedAmount(t.Type, t.Amount));

            decimal TodayIn(CashBoxType box) => cashTransactions
                .Where(t => t.BoxType == box && CashTransactionTypeHelper.IsCredit(t.Type)
                    && t.CreatedDate.HasValue && t.CreatedDate.Value >= todayStartUtc && t.CreatedDate.Value <= todayEndUtc)
                .Sum(t => t.Amount);

            decimal TodayOut(CashBoxType box) => cashTransactions
                .Where(t => t.BoxType == box && !CashTransactionTypeHelper.IsCredit(t.Type)
                    && t.CreatedDate.HasValue && t.CreatedDate.Value >= todayStartUtc && t.CreatedDate.Value <= todayEndUtc)
                .Sum(t => t.Amount);

            var storeCash = new StoreCashDto
            {
                Amount = Balance(CashBoxType.Store),
                CashIn = TodayIn(CashBoxType.Store),
                CashOut = TodayOut(CashBoxType.Store),
            };

            var transfersBox = new TransfersBoxDto
            {
                Amount = Balance(CashBoxType.Transfers),
                TodayIn = TodayIn(CashBoxType.Transfers),
            };

            // ---- Used gold on hand ----
            var pools = await UsedGoldPoolCalculator.GetPoolsAsync(_context, cancellationToken);
            var goldWeightOnHand = pools.Sum(p => p.Value.Weight);
            var goldInvestedValue = pools.Sum(p => p.Value.Cost);
            var goldAverageKarat = goldWeightOnHand > 0
                ? pools.Sum(p => p.Key * p.Value.Weight) / goldWeightOnHand
                : 0;

            var usedGoldOnHand = new UsedGoldOnHandDto
            {
                Weight = goldWeightOnHand,
                AvgKarat = goldAverageKarat,
                InvestedValue = goldInvestedValue,
            };

            // ---- Stock value ----
            var products = await _context.Products
                .AsNoTracking()
                .Select(p => new { p.Id, p.Weight, p.Quantity, p.KaratType, p.Type })
                .ToListAsync(cancellationToken);

            var pricingSettings = await _context.PricingSettings
                .AsNoTracking()
                .ToDictionaryAsync(ps => new { ps.KaratType, ps.ProductType }, ps => ps.Price, cancellationToken);

            var productIds = products.Select(p => p.Id).ToList();
            var specialPricings = await _context.ProductSpecialPricings
                .AsNoTracking()
                .Where(x => productIds.Contains(x.ProductId))
                .ToDictionaryAsync(x => x.ProductId, x => x.SpecialPricePerGram, cancellationToken);

            var pricedProducts = products.Select(p =>
            {
                var pricePerGram = specialPricings.TryGetValue(p.Id, out var sp)
                    ? sp
                    : pricingSettings.GetValueOrDefault(new { p.KaratType, ProductType = p.Type }, 0);

                return new
                {
                    Quantity = p.Quantity ?? 0,
                    p.Weight,
                    Price = p.Weight * pricePerGram,
                };
            }).ToList();


            var stockValue = new StockValueDto
            {
                Amount = pricedProducts.Sum(p => p.Price * p.Quantity),
                Items = pricedProducts.Sum(p => p.Quantity),
                Weight = pricedProducts.Sum(p => p.Weight * p.Quantity),
            };

            // ---- Needs attention ----
            var attention = new List<AttentionItemDto>();

            if (overdueCount > 0)
            {
                var oldestDueDate = repairs
                    .Where(r => r.Status == RepairStatus.InProgress && r.DueDate.HasValue && r.DueDate.Value < todayDate)
                    .Min(r => r.DueDate!.Value);
                var daysOverdue = todayDate.DayNumber - oldestDueDate.DayNumber;

                attention.Add(new AttentionItemDto
                {
                    Color = "red",
                    Text = $"{overdueCount} repair{(overdueCount == 1 ? "" : "s")} overdue — oldest {daysOverdue} day{(daysOverdue == 1 ? "" : "s")}",
                    Tag = "Repairs",
                });
            }

            if (awaitingCallCount > 0)
            {
                attention.Add(new AttentionItemDto
                {
                    Color = "amber",
                    Text = $"{awaitingCallCount} repair{(awaitingCallCount == 1 ? "" : "s")} done, customer not called yet",
                    Tag = "Call",
                });
            }

            if (needsTagsCount > 0)
            {
                attention.Add(new AttentionItemDto
                {
                    Color = "blue",
                    Text = $"{needsTagsCount} returned item{(needsTagsCount == 1 ? "" : "s")} need tags printed",
                    Tag = "Tags",
                });
            }

            var dto = new AdminDashboardStatsDto
            {
                Today = new AdminDashboardTodayDto
                {
                    SalesRevenue = salesRevenue,
                    RepairsCollected = repairsCollected,
                    RefundsPaidOut = refundsPaidOut,
                    UsedGoldBought = usedGoldBought,
                },
                Now = new AdminDashboardNowDto
                {
                    StoreCash = storeCash,
                    TransfersBox = transfersBox,
                    UsedGoldOnHand = usedGoldOnHand,
                    StockValue = stockValue,
                },
                SalesTrend = salesTrend,
                Payments = payments,
                Repairs = repairsStats,
                GoldSoldToday = goldSoldToday,
                TopCategory = topCategory,
                Attention = attention,
            };

            return GenericResponse<AdminDashboardStatsDto>.Success(dto);
        }
    }
}
