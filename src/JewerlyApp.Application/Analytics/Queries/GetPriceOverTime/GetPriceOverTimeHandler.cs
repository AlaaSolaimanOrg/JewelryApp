using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Linq;

namespace JewerlyApp.Application.Analytics.Queries.GetGoldPriceOverTime
{
    public class GetPriceOverTimeHandler
        : IRequestHandler<GetPriceOverTimeQuery, GenericResponse<List<PriceOverTimeChartVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetPriceOverTimeHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<PriceOverTimeChartVM>>> Handle(
            GetPriceOverTimeQuery request,
            CancellationToken cancellationToken)
        {
            // 1️⃣ Resolve date range
            DateTime dateFrom = request.DateFrom ?? DateTime.MinValue;
            DateTime dateTo = request.DateTo ?? DateTime.MaxValue;

            // Only auto-calc range if user did NOT provide dates
            if (request.ReportType.HasValue && !request.DateFrom.HasValue && !request.DateTo.HasValue)
            {
                (dateFrom, dateTo) = DateRangeHelper.GetDateRange(request.ReportType.Value);
            }

            // 2️⃣ Load pricing logs
            var logs = await _context.PricingSettingLogs
                .AsNoTracking()
                .Where(x =>
                    x.ProductType == ProductType.Gold &&
                    x.CreatedDate.HasValue &&
                    x.CreatedDate.Value >= dateFrom &&
                    x.CreatedDate.Value <= dateTo)
                .OrderBy(x => x.CreatedDate)
                .ToListAsync(cancellationToken);

            // 3️⃣ Decide grouping based on ReportType
            Func<PricingSettingLog, DateTime> groupKey = request.ReportType switch
            {
                // Hourly
                ReportType.Daily => x => new DateTime(
                    x.CreatedDate!.Value.Year,
                    x.CreatedDate!.Value.Month,
                    x.CreatedDate!.Value.Day,
                    x.CreatedDate!.Value.Hour,
                    0, 0),

                // Daily
                ReportType.Weekly  => x => new DateTime(
                    x.CreatedDate!.Value.Year,
                    x.CreatedDate!.Value.Month,
                    x.CreatedDate!.Value.Day),

                // Monthly ✅
                ReportType.Monthly => x => new DateTime(
                    x.CreatedDate!.Value.Year,
                    x.CreatedDate!.Value.Month,
                    1),

                // Yearly ✅
                ReportType.Yearly => x => new DateTime(
                    x.CreatedDate!.Value.Year,
                    1,
                    1),
                // AllTime (fallback) → minute precision
                _ => x => new DateTime(
                    x.CreatedDate!.Value.Year,
                    x.CreatedDate!.Value.Month,
                    x.CreatedDate!.Value.Day,
                    x.CreatedDate!.Value.Hour,
                    x.CreatedDate!.Value.Minute,
                    0)
            };

            // 4️⃣ Group & project
            var result = logs
                .GroupBy(groupKey)
                .Select(g => new PriceOverTimeChartVM
                {
                    DateLabel = request.ReportType switch
                    {
                        ReportType.Daily => g.Key.ToString("HH:mm", CultureInfo.InvariantCulture),
                        ReportType.Weekly  => g.Key.ToString("MMM dd", CultureInfo.InvariantCulture),
                        ReportType.Monthly => g.Key.ToString("MMM", CultureInfo.InvariantCulture),
                        ReportType.Yearly => g.Key.ToString("MMM yyyy", CultureInfo.InvariantCulture),
                        _ => g.Key.ToString("MMM dd HH:mm", CultureInfo.InvariantCulture)
                    },
                    Karat18 = g.FirstOrDefault(x => x.KaratType == KaratType.Karat18)?.NewPrice ?? 0,
                    Karat21 = g.FirstOrDefault(x => x.KaratType == KaratType.Karat21)?.NewPrice ?? 0,
                    Karat22 = g.FirstOrDefault(x => x.KaratType == KaratType.Karat22)?.NewPrice ?? 0,
                    Karat24 = g.FirstOrDefault(x => x.KaratType == KaratType.Karat24)?.NewPrice ?? 0
                })
                .OrderBy(x => x.DateLabel)
                .ToList();

            // 5️⃣ Return response
            return new GenericResponse<List<PriceOverTimeChartVM>>
            {
                Data = result,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
