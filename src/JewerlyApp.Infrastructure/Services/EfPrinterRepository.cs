using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Infrastructure.Services
{
    public class EfPrinterRepository : IPrinterRepository
    {
        private readonly ApplicationDbContext _context;

        public EfPrinterRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Printer printer, CancellationToken cancellationToken)
        {
            await _context.Printers.AddAsync(printer, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<Printer?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _context.Printers.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }

        public async Task<Printer?> GetByStoreAndCodeAsync(string storeId, string code, CancellationToken cancellationToken)
        {
            return await _context.Printers
                .FirstOrDefaultAsync(x => x.StoreId == storeId && x.Code == code, cancellationToken);
        }

        public async Task<List<Printer>> GetByStoreAsync(string storeId, CancellationToken cancellationToken)
        {
            return await _context.Printers
                .Where(x => x.StoreId == storeId)
                .ToListAsync(cancellationToken);
        }

        public async Task UpdateAsync(Printer printer, CancellationToken cancellationToken)
        {
            _context.Printers.Update(printer);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            var printer = await _context.Printers.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
            if (printer is null)
            {
                return;
            }

            _context.Printers.Remove(printer);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}