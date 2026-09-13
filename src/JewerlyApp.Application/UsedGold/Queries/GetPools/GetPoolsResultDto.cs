using System.Collections.Generic;

namespace JewerlyApp.Application.UsedGold.Queries.GetPools
{
    public class GetPoolsResultDto
    {
        public Dictionary<int, GoldPoolDto> Pools { get; set; } = new();
        public int PeriodPurchaseCount { get; set; }
        public decimal PeriodSpent { get; set; }
    }
}
