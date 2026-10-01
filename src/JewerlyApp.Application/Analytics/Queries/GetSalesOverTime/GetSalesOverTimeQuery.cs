using JewerlyApp.Application.Common.Queries;
using System;
using System.Collections.Generic;
using MediatR;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;

namespace JewerlyApp.Application.Analytics.Queries.GetSalesOverTime
{
    public class GetSalesOverTimeQuery : IDateRangeQuery, IRequest<GenericResponse<List<SalesOverTimeVM>>>
    {
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }

        // Nullable so callers can omit the report type and request all-time data.
        public ReportType? ReportType { get; set; } = null;
    }
}
