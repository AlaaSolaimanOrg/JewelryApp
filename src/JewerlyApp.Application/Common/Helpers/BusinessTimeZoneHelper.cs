using System;

namespace JewerlyApp.Application.Common.Helpers
{
    public static class BusinessTimeZoneHelper
    {
        public const string EdmontonTimeZoneId = "America/Edmonton";

        private static readonly TimeZoneInfo EdmontonTimeZone =
            TimeZoneInfo.FindSystemTimeZoneById(EdmontonTimeZoneId);

        public static DateTime GetEdmontonNow()
        {
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, EdmontonTimeZone);
        }

        public static DateOnly GetEdmontonDate()
        {
            return DateOnly.FromDateTime(GetEdmontonNow());
        }

        public static DateTime ConvertUtcToEdmonton(DateTime value)
        {
            var utcValue = value.Kind switch
            {
                DateTimeKind.Utc => value,
                DateTimeKind.Local => value.ToUniversalTime(),
                _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
            };

            return TimeZoneInfo.ConvertTimeFromUtc(utcValue, EdmontonTimeZone);
        }

        public static DateTimeOffset ConvertUtcToEdmontonOffset(DateTime value)
        {
            var utcValue = value.Kind switch
            {
                DateTimeKind.Utc => value,
                DateTimeKind.Local => value.ToUniversalTime(),
                _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
            };

            var offset = EdmontonTimeZone.GetUtcOffset(utcValue);
            return new DateTimeOffset(utcValue, TimeSpan.Zero).ToOffset(offset);
        }

        public static DateTime ConvertEdmontonToUtc(DateTime edmontonLocal)
        {
            var localUnspecified = DateTime.SpecifyKind(edmontonLocal, DateTimeKind.Unspecified);
            return TimeZoneInfo.ConvertTimeToUtc(localUnspecified, EdmontonTimeZone);
        }

        public static (DateTime StartUtc, DateTime EndUtc) GetUtcBoundsForEdmontonDate(DateOnly date)
        {
            var startLocal = new DateTime(date.Year, date.Month, date.Day, 0, 0, 0, DateTimeKind.Unspecified);
            var endLocal = startLocal.AddDays(1).AddTicks(-1);

            return (ConvertEdmontonToUtc(startLocal), ConvertEdmontonToUtc(endLocal));
        }
    }
}
