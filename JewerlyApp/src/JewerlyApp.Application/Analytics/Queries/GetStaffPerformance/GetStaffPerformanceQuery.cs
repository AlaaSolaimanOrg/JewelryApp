using System;
using System.Collections.Generic;
using MediatR;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;

namespace JewerlyApp.Application.Analytics.Queries.GetStaffPerformance
{
    public class GetStaffPerformanceQuery : IRequest<GenericResponse<List<StaffPerformanceVM>>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }

        // Nullable so callers can omit the report type and request all-time data.
        public ReportType? ReportType { get; set; }
    }
}
