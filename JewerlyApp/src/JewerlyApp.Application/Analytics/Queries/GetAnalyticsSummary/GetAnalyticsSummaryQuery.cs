using System;
using MediatR;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;

namespace JewerlyApp.Application.Analytics.Queries.GetAnalyticsSummary
{
    public class GetAnalyticsSummaryQuery : IRequest<GenericResponse<AnalyticsSummaryVM>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }

        // Made nullable so callers can omit the report-type filter and request all-time data.
        public ReportType? ReportType { get; set; }
    }
}
