using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;

namespace JewerlyApp.Application.CashManagement.Commands.MoveMoney
{
    public class MoveMoneyCommand : IRequest<GenericResponse<Guid>>
    {
        // The box the money is moving OUT of. It moves IN to the other box.
        public CashBoxType FromBox { get; set; }
        public decimal Amount { get; set; }
        public string? Reason { get; set; }
    }
}
