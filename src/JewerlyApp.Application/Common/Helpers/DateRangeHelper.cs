using JewerlyApp.Domain.Enums;
using System;

namespace JewerlyApp.Application.Common.Helpers
{
    public static class DateRangeHelper
    {
            public static (DateTime Start, DateTime End) GetDateRange(ReportType reportType)
            {
                var today = DateTime.Today;
                DateTime start = today;
                DateTime end = today.AddDays(1).AddTicks(-1);

                switch (reportType)
                {
                    case ReportType.Daily:
                        start = today;
                        end = today.AddDays(1).AddTicks(-1);
                        break;
                    case ReportType.Weekly:
                        var diff = (7 + (today.DayOfWeek - DayOfWeek.Monday)) % 7;
                        start = today.AddDays(-1 * diff).Date;
                        end = start.AddDays(7).AddTicks(-1);
                        break;
                    case ReportType.Monthly:
                        start = new DateTime(today.Year, today.Month, 1);
                        end = start.AddMonths(1).AddTicks(-1);
                        break;
                    case ReportType.Yearly:
                        start = new DateTime(today.Year, 1, 1);
                        end = start.AddYears(1).AddTicks(-1);
                        break;
                }

                return (start, end);
            }
    }
}
