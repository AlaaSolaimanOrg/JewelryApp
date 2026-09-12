using JewerlyApp.Application.CashManagement.Commands.AddExpense;
using JewerlyApp.Application.CashManagement.Commands.ManualCashIn;
using JewerlyApp.Application.CashManagement.Commands.MoveMoney;
using JewerlyApp.Application.CashManagement.Commands.TransferIncome;
using JewerlyApp.Application.CashManagement.Queries.GetCashBalances;
using JewerlyApp.Application.CashManagement.Queries.GetCashTransactions;
using Microsoft.AspNetCore.Mvc;

namespace JewerlyApp.API.Controllers
{
    [ApiController]
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
    }
}
