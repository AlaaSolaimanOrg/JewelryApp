using JewerlyApp.Application.Returns.Commands.CreateReturn;
using JewerlyApp.Application.Returns.Commands.MarkReturnItemsPrinted;
using JewerlyApp.Application.Returns.Queries.GetReturnItems;
using JewerlyApp.Application.Returns.Queries.GetReturnItemsCounts;
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


        /// <summary>
        /// flat, paginated list of returned items for tag printing
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetReturnItems([FromQuery] GetReturnItemsQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// counts for the needs tags / printed / all tabs
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetReturnItemsCounts([FromQuery] GetReturnItemsCountsQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// mark returned items' tags as printed
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> MarkReturnItemsPrinted([FromBody] MarkReturnItemsPrintedCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
    }
}
