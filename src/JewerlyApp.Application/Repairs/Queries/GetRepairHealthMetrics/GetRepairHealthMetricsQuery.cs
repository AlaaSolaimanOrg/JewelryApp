using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairHealthMetrics
{
    public class GetRepairHealthMetricsQuery : IRequest<GenericResponse<RepairHealthMetricsVM>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
