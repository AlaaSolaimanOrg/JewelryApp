using JewerlyApp.Application.Common.Queries;
using MediatR;
using System;

namespace JewerlyApp.Application.Analytics.Queries.GetStaplesSold
{
    public class GetStaplesSoldQuery : SortedPaginatedQuery, IRequest<StaplesSoldResponse>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
