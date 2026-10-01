using JewerlyApp.Application.Common.Queries;
using System;
using System.Collections.Generic;
using MediatR;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;

namespace JewerlyApp.Application.Analytics.Queries.GetStaffPerformance
{
    public class GetStaffPerformanceQuery : IDateRangeQuery, IRequest<GenericResponse<List<StaffPerformanceVM>>>
    {
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }
        public ReportType? ReportType { get; set; } = null;
    }
}
