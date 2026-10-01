using JewerlyApp.Domain.Enums;
using System;

namespace JewerlyApp.Application.Common.Helpers
{
    public static class DateRangeHelper
    {
        public static (DateOnly Start, DateOnly End) GetBusinessDateRange(ReportType reportType)
        {
            var today = BusinessTimeZoneHelper.GetBusinessDate();

            switch (reportType)
            {
                case ReportType.Weekly:
                    var diff = (7 + (today.DayOfWeek - DayOfWeek.Monday)) % 7;
                    var weekStart = today.AddDays(-1 * diff);
                    return (weekStart, weekStart.AddDays(6));
                case ReportType.Monthly:
                    var monthStart = new DateOnly(today.Year, today.Month, 1);
                    return (monthStart, monthStart.AddMonths(1).AddDays(-1));
                case ReportType.Yearly:
                    var yearStart = new DateOnly(today.Year, 1, 1);
                    return (yearStart, yearStart.AddYears(1).AddDays(-1));
                default:
                    return (today, today);
            }
        }
    }
}
