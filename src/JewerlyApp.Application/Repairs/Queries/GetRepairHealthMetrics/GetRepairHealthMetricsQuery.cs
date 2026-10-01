using JewerlyApp.Domain.Enums;
using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairHealthMetrics
{
    public class GetRepairHealthMetricsQuery : IDateRangeQuery, IRequest<GenericResponse<RepairHealthMetricsVM>>
    {
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }
        public ReportType? ReportType { get; set; }
    }
}
