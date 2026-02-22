using JewerlyApp.Application.Common.Helpers;
using System;
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace JewerlyApp.API.Serialization
{
    public sealed class EdmontonDateTimeJsonConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TryGetDateTime(out var value))
            {
                return value;
            }

            throw new JsonException("Invalid DateTime value.");
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            var edmontonTime = BusinessTimeZoneHelper.ConvertUtcToEdmontonOffset(value);
            writer.WriteStringValue(edmontonTime.ToString("yyyy-MM-ddTHH:mm:ss.fffffffzzz", CultureInfo.InvariantCulture));
        }
    }
}
