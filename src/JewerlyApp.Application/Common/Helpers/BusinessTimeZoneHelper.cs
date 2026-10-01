using System;

namespace JewerlyApp.Application.Common.Helpers
{
    public static class BusinessTimeZoneHelper
    {
        private static TimeZoneInfo? _businessTimeZone;

        private static TimeZoneInfo BusinessTimeZone =>
            _businessTimeZone ?? throw new InvalidOperationException(
                "Business time zone is not configured. Call BusinessTimeZoneHelper.Configure at startup.");

        public static void Configure(string timeZoneId)
        {
            _businessTimeZone = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
        }

        public static DateTime GetBusinessNow()
        {
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, BusinessTimeZone);
        }

        public static DateOnly GetBusinessDate()
        {
            return DateOnly.FromDateTime(GetBusinessNow());
        }

        public static DateTime ConvertUtcToBusiness(DateTime value)
        {
            return TimeZoneInfo.ConvertTimeFromUtc(AsUtc(value), BusinessTimeZone);
        }

        public static DateOnly ConvertUtcToBusinessDate(DateTime value)
        {
            return DateOnly.FromDateTime(ConvertUtcToBusiness(value));
        }

        public static DateTimeOffset ConvertUtcToBusinessOffset(DateTime value)
        {
            var utcValue = AsUtc(value);
            var offset = BusinessTimeZone.GetUtcOffset(utcValue);
            return new DateTimeOffset(utcValue, TimeSpan.Zero).ToOffset(offset);
        }

        public static DateTime ConvertBusinessToUtc(DateTime businessLocal)
        {
            var localUnspecified = DateTime.SpecifyKind(businessLocal, DateTimeKind.Unspecified);
            return TimeZoneInfo.ConvertTimeToUtc(localUnspecified, BusinessTimeZone);
        }

        public static (DateTime StartUtc, DateTime EndUtc) GetUtcBoundsForBusinessDate(DateOnly date)
        {
            var startLocal = new DateTime(date.Year, date.Month, date.Day, 0, 0, 0, DateTimeKind.Unspecified);
            var endLocal = startLocal.AddDays(1).AddTicks(-1);

            return (ConvertBusinessToUtc(startLocal), ConvertBusinessToUtc(endLocal));
        }

        private static DateTime AsUtc(DateTime value)
        {
            return value.Kind switch
            {
                DateTimeKind.Utc => value,
                DateTimeKind.Local => value.ToUniversalTime(),
                _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
            };
        }
    }
}
