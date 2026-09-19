using JewerlyApp.Application.InventorySettings.Commands.UpdateLowStockThreshold;
using JewerlyApp.Application.InventorySettings.Queries.GetLowStockThreshold;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JewerlyApp.API.Controllers.InventorySettings
{
    [ApiController]
    public class InventorySettingsController : MainController
    {
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetLowStockThreshold()
        {
            var response = await Mediator.Send(new GetLowStockThresholdQuery());
            return CreateResponse(response);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateLowStockThreshold([FromBody] UpdateLowStockThresholdCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
    }
}
