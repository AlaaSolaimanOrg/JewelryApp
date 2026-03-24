using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using JewerlyApp.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace JewerlyApp.Infrastructure.Services
{
    public class EfPrintJobRepository : IPrintJobRepository
    {
        private readonly ApplicationDbContext _context;

        public EfPrintJobRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(PrintJob job, CancellationToken cancellationToken)
        {
            await _context.PrintJobs.AddAsync(job, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<PrintJob?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _context.PrintJobs.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }

        public async Task<PrintJob?> ClaimNextPendingAsync(string storeId, string printerId, CancellationToken cancellationToken)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync(IsolationLevel.Serializable, cancellationToken);

            var pendingJob = await _context.PrintJobs
                .Where(x => x.StoreId == storeId && x.PrinterId == printerId && x.Status == PrintJobStatus.Pending)
                .OrderBy(x => x.CreatedAt)
                .FirstOrDefaultAsync(cancellationToken);

            if (pendingJob is null)
            {
                await transaction.CommitAsync(cancellationToken);
                return null;
            }

            pendingJob.Status = PrintJobStatus.Claimed;
            pendingJob.ClaimedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            return pendingJob;
        }

        public async Task MarkStartedAsync(Guid jobId, CancellationToken cancellationToken)
        {
            var job = await _context.PrintJobs.FirstOrDefaultAsync(x => x.Id == jobId, cancellationToken)
                ?? throw new InvalidOperationException($"Print job '{jobId}' was not found.");

            job.Status = PrintJobStatus.Printing;
            job.StartedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task MarkSucceededAsync(Guid jobId, CancellationToken cancellationToken)
        {
            var job = await _context.PrintJobs.FirstOrDefaultAsync(x => x.Id == jobId, cancellationToken)
                ?? throw new InvalidOperationException($"Print job '{jobId}' was not found.");

            job.Status = PrintJobStatus.Printed;
            job.CompletedAt = DateTime.UtcNow;
            job.FailureReason = null;
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task MarkFailedAsync(Guid jobId, string failureReason, CancellationToken cancellationToken)
        {
            var job = await _context.PrintJobs.FirstOrDefaultAsync(x => x.Id == jobId, cancellationToken)
                ?? throw new InvalidOperationException($"Print job '{jobId}' was not found.");

            job.Status = PrintJobStatus.Failed;
            job.CompletedAt = DateTime.UtcNow;
            job.FailureReason = failureReason;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}