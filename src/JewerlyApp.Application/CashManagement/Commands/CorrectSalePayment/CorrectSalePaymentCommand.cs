using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.CashManagement.Commands.CorrectSalePayment
{
    public class CorrectSalePaymentCommand : IRequest<GenericResponse<Guid>>
    {
        public Guid SaleId { get; set; }
        public decimal CashAmount { get; set; }
        public decimal CardAmount { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}
