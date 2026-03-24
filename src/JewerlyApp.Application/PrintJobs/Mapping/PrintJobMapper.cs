using JewerlyApp.Application.PrintJobs.Dtos;
using JewerlyApp.Domain.Entities;

namespace JewerlyApp.Application.PrintJobs.Mapping
{
    public static class PrintJobMapper
    {
        public static PrintJobDto ToDto(this PrintJob printJob)
        {
            return new PrintJobDto
            {
                Id = printJob.Id,
                StoreId = printJob.StoreId,
                PrinterId = printJob.PrinterId,
                Status = printJob.Status,
                Payload = printJob.Payload,
                CreatedAt = printJob.CreatedAt,
                ClaimedAt = printJob.ClaimedAt,
                StartedAt = printJob.StartedAt,
                CompletedAt = printJob.CompletedAt,
                FailureReason = printJob.FailureReason
            };
        }
    }
}