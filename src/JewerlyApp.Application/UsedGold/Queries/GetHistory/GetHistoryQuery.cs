using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.UsedGold.Queries.GetHistory
{
    public class GetHistoryQuery : SortedPaginatedQuery, IRequest<PaginatedResponse<UsedGoldHistoryDto>>
    {
        public string? SearchBy { get; set; }
        public string? TypeFilter { get; set; }

        // "month" | "year" | "all"
        public string Period { get; set; } = "all";

        // 0-based, matches JS Date month convention
        public int Month { get; set; }
        public int Year { get; set; }
    }
}
