using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Repairs.Dtos;
using JewerlyApp.Domain.Enums;
using MediatR;
using System.Collections.Generic;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairs
{
    public class GetRepairsQuery : IRequest<GenericResponse<List<RepairDto>>>
    {
        public RepairStatus? Status { get; set; }
    }
}
