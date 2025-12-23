using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

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

            if (request.ReportType.HasValue)
            {
                // Optional: you can use your helper for report type ranges
                (dateFrom, dateTo) = DateRangeHelper.GetDateRange(request.ReportType.Value);
            }

            // 2️⃣ Load gold pricing logs
            var logs = await _context.PricingSettingLogs
                .AsNoTracking()
                .Where(x =>
                    x.ProductType == ProductType.Gold &&
                    x.CreatedDate.HasValue &&
                    x.CreatedDate.Value >= dateFrom &&
                    x.CreatedDate.Value <= dateTo)
                .OrderBy(x => x.CreatedDate)
                .ToListAsync(cancellationToken);

            // 3️⃣ Group by CreatedDate (full timestamp)
            var result = logs
      .GroupBy(x => new DateTime(
          x.CreatedDate!.Value.Year,
          x.CreatedDate!.Value.Month,
          x.CreatedDate!.Value.Day,
          x.CreatedDate!.Value.Hour,
          x.CreatedDate!.Value.Minute,
          0)) // round to minute
      .Select(g => new PriceOverTimeChartVM
      {
          DateLabel = g.Key.ToString("MMM dd HH:mm", CultureInfo.InvariantCulture),
          Karat18 = g.FirstOrDefault(x => x.KaratType == KaratType.Karat18)?.NewPrice ?? 0,
          Karat21 = g.FirstOrDefault(x => x.KaratType == KaratType.Karat21)?.NewPrice ?? 0,
          Karat22 = g.FirstOrDefault(x => x.KaratType == KaratType.Karat22)?.NewPrice ?? 0,
          Karat24 = g.FirstOrDefault(x => x.KaratType == KaratType.Karat24)?.NewPrice ?? 0
      })
      .OrderBy(x => x.DateLabel)
      .ToList();


            return new GenericResponse<List<PriceOverTimeChartVM>>
            {
                Data = result,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
