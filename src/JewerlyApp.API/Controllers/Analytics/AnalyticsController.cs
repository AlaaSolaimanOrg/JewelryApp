using JewerlyApp.Application.Analytics.Queries.GetAnalyticsSummary;
using JewerlyApp.Application.Analytics.Queries.GetCustomerRetention;
using JewerlyApp.Application.Analytics.Queries.GetGoldPriceOverTime;
using JewerlyApp.Application.Analytics.Queries.GetInventoryAging;
using JewerlyApp.Application.Analytics.Queries.GetInventoryMovement;
using JewerlyApp.Application.Analytics.Queries.GetInventoryStockSummary;
using JewerlyApp.Application.Analytics.Queries.GetMovementByPurity;
using JewerlyApp.Application.Analytics.Queries.GetSalesByCategory;
using JewerlyApp.Application.Analytics.Queries.GetSalesOverTime;
using JewerlyApp.Application.Analytics.Queries.GetStaffPerformance;
using JewerlyApp.Application.Analytics.Queries.GetStaplesSold;
using JewerlyApp.Application.Analytics.Queries.GetStockByCategory;
using JewerlyApp.Application.Analytics.Queries.GetStockByPurity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace JewerlyApp.API.Controllers.Analytics
{
    [Authorize]    
    public class AnalyticsController : MainController
    {
        /// <summary>
        /// Get sales over time analytics
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetSalesOverTime([FromQuery] GetSalesOverTimeQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// Get sales by category analytics
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetSalesByCategory([FromQuery] GetSalesByCategoryQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// Get staff performance analytics
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetStaffPerformance([FromQuery] GetStaffPerformanceQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// Get analytics summary
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAnalyticsSummary([FromQuery] GetAnalyticsSummaryQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// Get Price Over Time
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetPriceOverTime([FromQuery] GetPriceOverTimeQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// Get customer retention analytics (new vs regular customers)
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetCustomerRetention([FromQuery] GetCustomerRetentionQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// Get inventory aging analytics — how long items sit before selling
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetInventoryAging()
        {
            var response = await Mediator.Send(new GetInventoryAgingQuery());
            return CreateResponse(response);
        }

        /// <summary>
        /// Get current stock totals — items in stock, categories, weight, value
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetInventoryStockSummary()
        {
            var response = await Mediator.Send(new GetInventoryStockSummaryQuery());
            return CreateResponse(response);
        }

        /// <summary>
        /// Get current stock broken down by karat/purity
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetStockByPurity()
        {
            var response = await Mediator.Send(new GetStockByPurityQuery());
            return CreateResponse(response);
        }

        /// <summary>
        /// Get current stock broken down by product category
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetStockByCategory()
        {
            var response = await Mediator.Send(new GetStockByCategoryQuery());
            return CreateResponse(response);
        }

        /// <summary>
        /// Get inventory movement (added/sold/returned/melted) within a date range
        /// </summary>
        /// <param name="query"></param>
        [HttpGet]
        public async Task<IActionResult> GetInventoryMovement([FromQuery] GetInventoryMovementQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// Get items added/returned within a date range, broken down by karat/purity
        /// </summary>
        /// <param name="query"></param>
        [HttpGet]
        public async Task<IActionResult> GetMovementByPurity([FromQuery] GetMovementByPurityQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// Get bullion/staple items sold within a date range, with current stock levels
        /// </summary>
        /// <param name="query"></param>
        [HttpGet]
        public async Task<IActionResult> GetStaplesSold([FromQuery] GetStaplesSoldQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }
    }
}
