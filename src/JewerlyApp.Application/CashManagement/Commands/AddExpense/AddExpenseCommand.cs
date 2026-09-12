using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.CashManagement.Commands.AddExpense
{
    public class AddExpenseCommand : IRequest<GenericResponse<Guid>>
    {
        public string Category { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Notes { get; set; } = string.Empty;
    }
}
