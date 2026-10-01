using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.CashManagement.Commands.TransferIncome
{
    public class TransferIncomeCommand : IRequest<GenericResponse<Guid>>
    {
        public string CustomerName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string? Destination { get; set; }
        public string? Notes { get; set; }
    }
}
