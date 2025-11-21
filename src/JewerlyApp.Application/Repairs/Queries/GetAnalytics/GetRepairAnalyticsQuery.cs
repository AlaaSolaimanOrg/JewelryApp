using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.Repairs.Queries.GetAnalytics
{
    public class GetRepairAnalyticsQuery : IRequest<GenericResponse<RepairAnalyticsDto>>
    {
    }

    public class RepairAnalyticsDto
    {
        public int TotalRepairs { get; set; }
        public int CompletedRepairs { get; set; }
        public int PendingRepairs { get; set; }
        public decimal TotalRevenue { get; set; }
        public string AverageRepairTime { get; set; } = string.Empty;
    }
}
