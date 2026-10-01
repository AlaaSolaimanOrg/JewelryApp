using JewerlyApp.Application.Common.Queries;
using System;

namespace JewerlyApp.Application.Common.Helpers
{
    public sealed record ReportDateRange(DateOnly? From, DateOnly? To, DateTime? StartUtc, DateTime? EndUtc)
    {
        public static ReportDateRange Resolve(IDateRangeQuery query)
        {
            DateOnly? from = null;
            DateOnly? to = null;

            if (query.DateFrom.HasValue || query.DateTo.HasValue)
            {
                from = query.DateFrom;
                to = query.DateTo;

                if (from.HasValue && to.HasValue && from.Value > to.Value)
                {
                    (from, to) = (to, from);
                }
            }
            else if (query.ReportType.HasValue)
            {
                (from, to) = DateRangeHelper.GetBusinessDateRange(query.ReportType.Value);
            }

            DateTime? startUtc = from.HasValue ? BusinessTimeZoneHelper.GetUtcBoundsForBusinessDate(from.Value).StartUtc : null;
            DateTime? endUtc = to.HasValue ? BusinessTimeZoneHelper.GetUtcBoundsForBusinessDate(to.Value).EndUtc : null;

            return new ReportDateRange(from, to, startUtc, endUtc);
        }
    }

    public static class DateRangeQueryExtensions
    {
        public static ReportDateRange ResolveDateRange(this IDateRangeQuery query)
        {
            return ReportDateRange.Resolve(query);
        }
    }
}
