using JewerlyApp.Application.Common.Responses;

namespace JewerlyApp.Application.Analytics.Queries.GetStaplesSold
{
    public class StaplesSoldResponse : PaginatedResponse<StapleSoldVM>
    {
        public int TotalSold { get; set; }
    }
}
