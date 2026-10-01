using JewerlyApp.Domain.Enums;
using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairsStats
{
    public class GetRepairsStatsQuery : IDateRangeQuery, IRequest<GenericResponse<RepairsStatsVM>>
    {
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }
        public ReportType? ReportType { get; set; }
    }
}
