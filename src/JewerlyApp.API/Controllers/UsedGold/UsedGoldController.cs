using JewerlyApp.Application.UsedGold.Commands.CreatePurchase;
using JewerlyApp.Application.UsedGold.Commands.ReturnToStock;
using JewerlyApp.Application.UsedGold.Commands.SendToMelt;
using JewerlyApp.Application.UsedGold.Queries.GetHistory;
using JewerlyApp.Application.UsedGold.Queries.GetPools;
using Microsoft.AspNetCore.Mvc;

namespace JewerlyApp.API.Controllers.UsedGold
{
    [ApiController]
    public class UsedGoldController : MainController
    {
        [HttpPost]
        public async Task<IActionResult> CreatePurchase([FromBody] CreateUsedGoldPurchaseCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetPools([FromQuery] GetPoolsQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetHistory([FromQuery] GetHistoryQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        [HttpPost]
        public async Task<IActionResult> SendToMelt([FromBody] SendToMeltCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [HttpPost]
        public async Task<IActionResult> ReturnToStock([FromBody] ReturnToStockCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
    }
}
