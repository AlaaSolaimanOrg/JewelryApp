using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Customers.Queries.GetNewCustomersChart
{
    public class GetNewCustomersChartQuery : IRequest<GenericResponse<List<NewCustomersChartPointVM>>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public NewCustomersChartGranularity Granularity { get; set; } = NewCustomersChartGranularity.Day;
    }
}
