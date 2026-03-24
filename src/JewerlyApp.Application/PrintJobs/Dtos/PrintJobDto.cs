using JewerlyApp.Domain.Enums;
using JewerlyApp.Domain.ValueObjects;

namespace JewerlyApp.Application.PrintJobs.Dtos
{
    public class PrintJobDto
    {
        public Guid Id { get; set; }
        public string StoreId { get; set; } = string.Empty;
        public string PrinterId { get; set; } = string.Empty;
        public PrintJobStatus Status { get; set; }
        public ReceiptPrintPayload Payload { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public DateTime? ClaimedAt { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? FailureReason { get; set; }
    }
}