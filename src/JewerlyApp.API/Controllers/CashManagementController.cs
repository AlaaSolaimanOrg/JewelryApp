using JewerlyApp.Application.CashManagement.Commands.AddExpense;
using JewerlyApp.Application.CashManagement.Commands.CorrectSalePayment;
using JewerlyApp.Application.CashManagement.Commands.ManualCashIn;
using JewerlyApp.Application.CashManagement.Commands.MoveMoney;
using JewerlyApp.Application.CashManagement.Commands.TransferIncome;
using JewerlyApp.Application.CashManagement.Queries.GetCashBalances;
using JewerlyApp.Application.CashManagement.Queries.GetCashTransactions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JewerlyApp.API.Controllers
{
    [ApiController]
    [Authorize(Roles = "Admin,PosRole,TerminalRole")]
    public class CashManagementController : MainController
    {
        [HttpGet]
        public async Task<IActionResult> GetCashBalances([FromQuery] GetCashBalancesQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetCashTransactions([FromQuery] GetCashTransactionsQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        [HttpPost]
        public async Task<IActionResult> AddExpense([FromBody] AddExpenseCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [HttpPost]
        public async Task<IActionResult> ManualCashIn([FromBody] ManualCashInCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [HttpPost]
        public async Task<IActionResult> TransferIncome([FromBody] TransferIncomeCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [HttpPost]
        public async Task<IActionResult> MoveMoney([FromBody] MoveMoneyCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CorrectSalePayment([FromBody] CorrectSalePaymentCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
    }
}
