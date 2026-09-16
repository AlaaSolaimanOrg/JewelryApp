using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairsRevenueChart
{
    public class GetRepairsRevenueChartQuery : IRequest<GenericResponse<List<ChartPointVM>>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public ChartGranularity Granularity { get; set; } = ChartGranularity.Day;
    }
}
