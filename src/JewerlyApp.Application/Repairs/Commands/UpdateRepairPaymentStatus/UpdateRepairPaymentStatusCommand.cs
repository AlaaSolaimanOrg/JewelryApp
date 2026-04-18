using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;

namespace JewerlyApp.Application.Repairs.Commands.UpdateRepairPaymentStatus
{
    public class UpdateRepairPaymentStatusCommand : IRequest<GenericResponse<Unit>>
    {
        public Guid Id { get; set; }
        public PaymentStatus NewPaymentStatus { get; set; }
    }
}
