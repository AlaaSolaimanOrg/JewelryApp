using JewerlyApp.Application.Security.Commands.UpdateSalesPin;
using JewerlyApp.Application.Security.Commands.VerifySalesPin;
using JewerlyApp.Application.Security.Queries.GetSalesPin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JewerlyApp.API.Controllers.Security
{
    [ApiController]
    public class SecuritySettingsController : MainController
    {
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSalesPin()
        {
            var response = await Mediator.Send(new GetSalesPinQuery());
            return CreateResponse(response);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateSalesPin([FromBody] UpdateSalesPinCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,PosRole,TerminalRole")]
        public async Task<IActionResult> VerifySalesPin([FromBody] VerifySalesPinCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
    }
}
