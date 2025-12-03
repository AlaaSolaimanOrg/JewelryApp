
using JewerlyApp.Domain.Enums;

namespace JewerlyApp.Domain.Entities
{
    public class Log
    {
        public Guid Id { get; set; }

        // Basic info
        public string HandlerName { get; set; } = string.Empty; // e.g., "CreateSaleCommandHandler"
        public string Message { get; set; } = string.Empty;
        public string? Exception { get; set; }
        public LogLevel Level { get; set; }

        // Generic content storage (JSON serialized)
        public string? Content { get; set; } // Can store any request/response object as JSON
        public string? Request { get; set; } // Stores the HTTP request body

        // User context
        public int? LoggedInUserId { get; set; }

        public string? CorrelationId { get; set; }

        // Timestamp
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
