using JewerlyApp.Application.Auth.Commands.Login;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JewerlyApp.API.Controllers
{
    
    public class AuthController : MainController
    {
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginCommand command)
        {
            var response = await Mediator.Send(command);
            return StatusCode((int)response.StatusCode, response);
        }
    }
}
