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
            var fullYear = DateTime.UtcNow.Year;
            var year = fullYear % 100; // LAST TWO DIGITS (2025 -> 25)

            var sequence = await _context.SkuSequences
                .FirstOrDefaultAsync(x => x.Category == category && x.Karat == karat && x.Year == fullYear);

            if (sequence == null)
            {
                sequence = new SkuSequence
                {
                    Category = category,
                    Karat = karat,
                    Year = fullYear,
                    LastNumber = 0
                };
                _context.SkuSequences.Add(sequence);
            }

            sequence.LastNumber++;
            await _context.SaveChangesAsync();

            var categoryCode = category switch
            {
                ProductCategory.Necklaces => "NC",
                ProductCategory.Bracelets => "BC",
                ProductCategory.Rings => "RG",
                ProductCategory.Earrings => "ER",
                ProductCategory.Pendants => "PD",
                ProductCategory.Bullion => "BL",
                _ => "GN"
            };

            // Final SKU: NEC2500001
            return $"{categoryCode}{year:D2}{sequence.LastNumber:D5}";
        }
    }
}
