using JewerlyApp.Domain.Entities;

namespace JewerlyApp.Application.Interfaces
{
    public interface IPrintJobRepository
    {
        Task AddAsync(PrintJob job, CancellationToken cancellationToken);
        Task<PrintJob?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
        Task<PrintJob?> ClaimNextPendingAsync(string storeId, string printerId, CancellationToken cancellationToken);
        Task MarkStartedAsync(Guid jobId, CancellationToken cancellationToken);
        Task MarkSucceededAsync(Guid jobId, CancellationToken cancellationToken);
        Task MarkFailedAsync(Guid jobId, string failureReason, CancellationToken cancellationToken);
    }
}