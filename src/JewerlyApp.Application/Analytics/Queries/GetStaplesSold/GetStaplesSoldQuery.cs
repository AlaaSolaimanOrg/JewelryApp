using JewerlyApp.Domain.Enums;
using JewerlyApp.Application.Common.Queries;
using MediatR;
using System;

namespace JewerlyApp.Application.Analytics.Queries.GetStaplesSold
{
    public class GetStaplesSoldQuery : SortedPaginatedQuery, IDateRangeQuery, IRequest<StaplesSoldResponse>
    {
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }
        public ReportType? ReportType { get; set; }
    }
}
