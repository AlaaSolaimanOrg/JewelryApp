using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Repairs.Dtos;
using JewerlyApp.Domain.Enums;
using MediatR;
using System.Collections.Generic;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairs
{
    public class GetRepairsQuery : SortedPaginatedQuery, IRequest<PaginatedResponse<RepairDto>>
    {
        public RepairStatus? Status { get; set; }
        public RepairType? RepairType { get; set; }
        public string? SearchBy { get; set; }

    }
}
