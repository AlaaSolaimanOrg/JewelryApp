using JewerlyApp.Domain.Entities.Common;
using System;

namespace JewerlyApp.Domain.Entities
{
    public class UsedGoldMeltBatchItem : Entity<Guid>
    {
        public Guid MeltBatchId { get; set; }
        public int Karat { get; set; }
        public decimal Weight { get; set; }
        public decimal Cost { get; set; }

        public UsedGoldMeltBatch MeltBatch { get; set; } = default!;
    }
}
