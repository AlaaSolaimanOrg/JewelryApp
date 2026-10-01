using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Analytics.Queries.GetMovementByPurity
{
    public class GetMovementByPurityQuery : IRequest<GenericResponse<PurityMovementVM>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
