using JewerlyApp.Application.Dashboard.Queries.GetPosDashboardStats;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace JewerlyApp.API.Controllers.Dashboard
{
    [Authorize]
    public class DashboardController : MainController
    {
        /// <summary>
        /// Get POS dashboard stats
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetPosDashboardStats()
        {
            var response = await Mediator.Send(new GetPosDashboardStatsQuery());
            return CreateResponse(response);
        }
    }
}
