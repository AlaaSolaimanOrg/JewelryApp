using JewerlyApp.Domain.Entities;

namespace JewerlyApp.Application.Interfaces
{
    public interface IPrinterRepository
    {
        Task AddAsync(Printer printer, CancellationToken cancellationToken);
        Task<Printer?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
        Task<Printer?> GetByStoreAndCodeAsync(string storeId, string code, CancellationToken cancellationToken);
        Task<List<Printer>> GetByStoreAsync(string storeId, CancellationToken cancellationToken);
        Task UpdateAsync(Printer printer, CancellationToken cancellationToken);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken);
    }
}