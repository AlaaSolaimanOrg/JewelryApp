using JewerlyApp.Domain.Enums;
using System;

namespace JewerlyApp.Application.Common.Helpers
{
    public static class DateRangeHelper
    {
            public static (DateTime Start, DateTime End) GetDateRange(ReportType reportType)
            {
                var today = BusinessTimeZoneHelper.GetEdmontonDate();
                var startDate = today;
                var endDate = today;

                switch (reportType)
                {
                    case ReportType.Daily:
                        startDate = today;
                        endDate = today;
                        break;
                    case ReportType.Weekly:
                        var diff = (7 + (today.DayOfWeek - DayOfWeek.Monday)) % 7;
                        startDate = today.AddDays(-1 * diff);
                        endDate = startDate.AddDays(6);
                        break;
                    case ReportType.Monthly:
                        startDate = new DateOnly(today.Year, today.Month, 1);
                        endDate = startDate.AddMonths(1).AddDays(-1);
                        break;
                    case ReportType.Yearly:
                        startDate = new DateOnly(today.Year, 1, 1);
                        endDate = startDate.AddYears(1).AddDays(-1);
                        break;
                }

                var (startUtc, _) = BusinessTimeZoneHelper.GetUtcBoundsForEdmontonDate(startDate);
                var (_, endUtc) = BusinessTimeZoneHelper.GetUtcBoundsForEdmontonDate(endDate);

                return (startUtc, endUtc);
            }
    }
}
