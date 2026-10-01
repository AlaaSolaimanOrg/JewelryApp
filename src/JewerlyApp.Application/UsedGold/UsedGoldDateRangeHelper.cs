using JewerlyApp.Application.Common.Helpers;
using System;

namespace JewerlyApp.Application.UsedGold
{
    public static class UsedGoldDateRangeHelper
    {
        public static (DateTime? StartUtc, DateTime? EndUtc) GetRange(string period, int month, int year)
        {
            if (period == "all")
                return (null, null);

            if (period == "year")
            {
                var startLocal = new DateTime(year, 1, 1, 0, 0, 0, DateTimeKind.Unspecified);
                var endLocal = startLocal.AddYears(1).AddTicks(-1);
                return (BusinessTimeZoneHelper.ConvertEdmontonToUtc(startLocal), BusinessTimeZoneHelper.ConvertEdmontonToUtc(endLocal));
            }

            // month (0-based)
            var monthStartLocal = new DateTime(year, month + 1, 1, 0, 0, 0, DateTimeKind.Unspecified);
            var monthEndLocal = monthStartLocal.AddMonths(1).AddTicks(-1);
            return (BusinessTimeZoneHelper.ConvertEdmontonToUtc(monthStartLocal), BusinessTimeZoneHelper.ConvertEdmontonToUtc(monthEndLocal));
        }
    }
}
