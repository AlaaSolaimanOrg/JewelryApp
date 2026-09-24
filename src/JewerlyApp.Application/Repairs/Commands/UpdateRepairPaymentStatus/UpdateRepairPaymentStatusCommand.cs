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
        public string? PayMethod { get; set; }
        public decimal CashAmount { get; set; }
        public decimal CardAmount { get; set; }
    }
}
