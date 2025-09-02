using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using JewerlyApp.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Infrastructure.Services
{
    public class SkuService : ISkuService
    {
        private readonly ApplicationDbContext _context;

        public SkuService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<string> GenerateSkuAsync(ProductCategory category, KaratType karat)
        {
            var year = DateTime.UtcNow.Year;
            var sequence = await _context.SkuSequences
                .FirstOrDefaultAsync(x => x.Category == category && x.Karat == karat && x.Year == year);

            if (sequence == null)
            {
                sequence = new SkuSequence
                {
                    Category = category,
                    Karat = karat,
                    Year = year,
                    LastNumber = 0
                };
                _context.SkuSequences.Add(sequence);
            }

            sequence.LastNumber++;
            await _context.SaveChangesAsync();

            var categoryCode = category switch
            {
                ProductCategory.Necklaces => "NEC",
                ProductCategory.Bracelets => "BRC",
                ProductCategory.Rings => "RNG",
                ProductCategory.Earrings => "EAR",
                ProductCategory.Pendants => "PND",
                ProductCategory.Bullion => "BUL",
                _ => "GEN"
            };

            return $"{categoryCode}-{(int)karat}-{year}-{sequence.LastNumber:D5}";
        }
    }
}
