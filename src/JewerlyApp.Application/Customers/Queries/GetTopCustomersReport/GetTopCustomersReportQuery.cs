using JewerlyApp.Domain.Enums;
using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Customers.Queries.GetTopCustomersReport
{
    public class GetTopCustomersReportQuery : SortedPaginatedQuery, IDateRangeQuery, IRequest<PaginatedResponse<CustomerReportRowVM>>
    {
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }
        public ReportType? ReportType { get; set; }
        public string? SearchBy { get; set; }
    }
}
