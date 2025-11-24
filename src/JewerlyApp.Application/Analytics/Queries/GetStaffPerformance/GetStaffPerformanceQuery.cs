using JewerlyApp.Domain.Enums;
using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Analytics.Queries.GetStaffPerformance
{
    public class GetStaffPerformanceQuery : IRequest<GenericResponse<List<StaffPerformanceVM>>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public ReportType ReportType { get; set; } = ReportType.Daily;
    }
}
