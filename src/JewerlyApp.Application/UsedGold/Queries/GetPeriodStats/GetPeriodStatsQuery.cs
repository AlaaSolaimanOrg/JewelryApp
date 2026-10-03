using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.UsedGold.Queries.GetPeriodStats
{
    public class GetPeriodStatsQuery : IRequest<GenericResponse<UsedGoldPeriodStatsDto>>
    {
        // "today" | "week" | "month" | "year" | "all"
        public string Period { get; set; } = "all";

        // 0-based, matches JS Date month convention
        public int Month { get; set; }
        public int Year { get; set; }
    }
}
