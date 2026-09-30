using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Customers.Queries.GetTopCustomersReport
{
    public class GetTopCustomersReportQuery : SortedPaginatedQuery, IRequest<PaginatedResponse<CustomerReportRowVM>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public string? SearchBy { get; set; }
    }
}
