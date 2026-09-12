using JewerlyApp.Application.UsedGold.Commands.CreatePurchase;
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
    }
}
