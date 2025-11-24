using JewerlyApp.Domain.Enums;
using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Analytics.Queries.GetSalesOverTime
{
    public class GetSalesOverTimeQuery : IRequest<GenericResponse<List<SalesOverTimeVM>>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public ReportType ReportType { get; set; } = ReportType.Daily;
    }
}
