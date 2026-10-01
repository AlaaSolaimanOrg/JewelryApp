using JewerlyApp.Domain.Enums;
using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Customers.Queries.GetNewCustomersChart
{
    public class GetNewCustomersChartQuery : IDateRangeQuery, IRequest<GenericResponse<List<NewCustomersChartPointVM>>>
    {
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }
        public ReportType? ReportType { get; set; }
        public NewCustomersChartGranularity Granularity { get; set; } = NewCustomersChartGranularity.Day;
    }
}
