using JewerlyApp.Domain.Enums;
using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Analytics.Queries.GetAnalyticsSummary
{
    public class GetAnalyticsSummaryQuery : IRequest<GenericResponse<AnalyticsSummaryVM>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public ReportType ReportType { get; set; } = ReportType.Daily;
    }
}
