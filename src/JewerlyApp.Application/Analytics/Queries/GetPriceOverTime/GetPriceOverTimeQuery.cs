using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Analytics.Queries.GetGoldPriceOverTime
{
    public class GetPriceOverTimeQuery
        : IRequest<GenericResponse<List<PriceOverTimeChartVM>>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public ReportType? ReportType { get; set; }
    }
}
