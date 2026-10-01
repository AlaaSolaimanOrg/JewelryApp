using JewerlyApp.Application.Common.Queries;
using System;
using MediatR;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;

namespace JewerlyApp.Application.Analytics.Queries.GetAnalyticsSummary
{
    public class GetAnalyticsSummaryQuery : IDateRangeQuery, IRequest<GenericResponse<AnalyticsSummaryVM>>
    {
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }

        // Made nullable so callers can omit the report-type filter and request all-time data.
        public ReportType? ReportType { get; set; } = null;
    }
}
