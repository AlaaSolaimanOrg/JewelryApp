using JewerlyApp.Application.Returns.Commands.CreateReturn;
using JewerlyApp.Application.Returns.Queries.GetReturns;
using JewerlyApp.Application.Sales.Commands.CreateSale;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JewerlyApp.API.Controllers.Returns
{
    //[Authorize]
    public class ReturnsController : MainController
    {
        /// <summary>
        /// create return
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> CreateReturn([FromBody] CreateReturnCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }


        [HttpGet]
        public async Task<IActionResult> GetReturns([FromQuery] GetReturnsQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }
    }
}
