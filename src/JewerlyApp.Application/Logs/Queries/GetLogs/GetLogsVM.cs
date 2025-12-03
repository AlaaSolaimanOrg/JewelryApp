using JewerlyApp.Domain.Enums;

namespace JewerlyApp.Application.Logs.Queries.GetLogs
{
    public class GetLogsVM
    {
        public Guid Id { get; set; }
        public string HandlerName { get; set; } = string.Empty;
        public string Request { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? Exception { get; set; }
        public string? Content { get; set; }
        public LogLevel Level { get; set; }
        public int? LoggedInUserId { get; set; }
        public string? UserName { get; set; }
        public string? CorrelationId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
