using JewerlyApp.Application.Products.Commands.ValidateProductImages;
using JewerlyApp.Application.Sales.Commands.CreateSale;
using JewerlyApp.Application.Sales.Queries.GetSaleById;
using JewerlyApp.Application.Sales.Queries.GetSalesInsights;
using JewerlyApp.Application.Sales.Queries.GetSalesList;
using JewerlyApp.Application.Sales.Queries.GetSoldItems;
using JewerlyApp.Application.Sales.Queries.SearchSales;
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
        [HttpGet]
        public async Task<IActionResult> GetSaleById([FromQuery] GetSaleDetailsQuery command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
        
        /// <summary>
        /// get sale list
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetSalesList([FromQuery] GetSalesListQuery command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
        
        /// <summary>
        /// search sales with detailed information
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> SearchSales([FromQuery] SearchSalesQuery command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
        
        /// <summary>
        /// get sales insights
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetSalesInsights([FromQuery] GetSalesInsightsQuery command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
        
        /// <summary>
        /// get items sold
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetSoldItems([FromQuery] GetSoldItemsQuery command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
    }
}
