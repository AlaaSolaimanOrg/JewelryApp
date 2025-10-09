using JewerlyApp.Application.Products.Commands.ValidateProductImages;
using JewerlyApp.Application.Sales.Commands.CreateSale;
using JewerlyApp.Application.Sales.Queries.GetSaleById;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JewerlyApp.API.Controllers.Sales
{
    [Authorize]
    public class SalesController : MainController
    {
        /// <summary>
        /// create sale
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> CreateSale([FromBody] CreateSaleCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
        
        /// <summary>
        /// get sale by id
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> GetSaleById([FromQuery] GetSaleByIdQuery command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
    }
}
