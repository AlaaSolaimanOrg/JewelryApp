using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;

namespace JewerlyApp.Application.Repairs.Commands.CreateRepair
{
    public class CreateRepairCommand : IRequest<GenericResponse<Guid>>
    {
        public Guid CustomerId { get; set; }
        public string Notes { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public PaymentStatus PaymentStatus { get; set; }
        public DateOnly? DueDate { get; set; }
    }
}
