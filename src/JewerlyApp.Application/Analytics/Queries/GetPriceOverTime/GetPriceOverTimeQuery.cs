using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Analytics.Queries.GetGoldPriceOverTime
{
    public class GetPriceOverTimeQuery
        : IDateRangeQuery, IRequest<GenericResponse<List<PriceOverTimeChartVM>>>
    {
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }
        public ReportType? ReportType { get; set; }
    }
}
