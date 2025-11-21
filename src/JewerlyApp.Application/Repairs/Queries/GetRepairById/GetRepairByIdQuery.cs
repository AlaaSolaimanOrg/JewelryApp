using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Repairs.Dtos;
using MediatR;
using System;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairById
{
    public class GetRepairByIdQuery : IRequest<GenericResponse<RepairDto>>
    {
        public Guid Id { get; set; }
    }
}
