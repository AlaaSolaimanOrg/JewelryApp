using JewerlyApp.Domain.Enums;
using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairsRevenueChart
{
    public class GetRepairsRevenueChartQuery : IDateRangeQuery, IRequest<GenericResponse<List<ChartPointVM>>>
    {
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }
        public ReportType? ReportType { get; set; }
        public ChartGranularity Granularity { get; set; } = ChartGranularity.Day;
    }
}
