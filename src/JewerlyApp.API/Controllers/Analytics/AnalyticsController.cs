using JewerlyApp.Application.Analytics.Queries.GetAnalyticsSummary;
using JewerlyApp.Application.Analytics.Queries.GetSalesByCategory;
using JewerlyApp.Application.Analytics.Queries.GetSalesOverTime;
using JewerlyApp.Application.Analytics.Queries.GetStaffPerformance;
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
    }
}
