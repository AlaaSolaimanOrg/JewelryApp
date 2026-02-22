using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace JewerlyApp.API.Serialization
{
    public sealed class EdmontonNullableDateTimeJsonConverter : JsonConverter<DateTime?>
    {
        private readonly EdmontonDateTimeJsonConverter _inner = new EdmontonDateTimeJsonConverter();

        public override DateTime? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.Null)
            {
                return null;
            }

            return _inner.Read(ref reader, typeof(DateTime), options);
        }

        public override void Write(Utf8JsonWriter writer, DateTime? value, JsonSerializerOptions options)
        {
            if (!value.HasValue)
            {
                writer.WriteNullValue();
                return;
            }

            _inner.Write(writer, value.Value, options);
        }
    }
}
