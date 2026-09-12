using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.CashManagement.Commands.ManualCashIn
{
    public class ManualCashInCommand : IRequest<GenericResponse<Guid>>
    {
        public string Source { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string? Notes { get; set; }
    }
}
