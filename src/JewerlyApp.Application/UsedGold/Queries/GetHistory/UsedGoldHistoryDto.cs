using System;

namespace JewerlyApp.Application.UsedGold.Queries.GetHistory
{
    public class UsedGoldHistoryDto
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; }

        // "purchase" | "melt" | "stock"
        public string Type { get; set; } = default!;
        public string Desc { get; set; } = default!;
        public string? Notes { get; set; }

        // null = mixed (melt batches)
        public int? Karat { get; set; }
        public decimal Weight { get; set; }
        public decimal Cost { get; set; }
    }
}
