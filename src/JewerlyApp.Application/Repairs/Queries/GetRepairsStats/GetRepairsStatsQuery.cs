using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairsStats
{
    public class GetRepairsStatsQuery : IRequest<GenericResponse<RepairsStatsVM>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
