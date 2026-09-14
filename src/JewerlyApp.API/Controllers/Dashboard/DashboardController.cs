using JewerlyApp.Application.Dashboard.Queries.GetAdminAttentionItems;
using JewerlyApp.Application.Dashboard.Queries.GetAdminCashGoldSnapshot;
using JewerlyApp.Application.Dashboard.Queries.GetAdminInventorySnapshot;
using JewerlyApp.Application.Dashboard.Queries.GetAdminRepairsStats;
using JewerlyApp.Application.Dashboard.Queries.GetAdminSalesSummary;
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

        /// <summary>
        /// Get admin dashboard sales summary (today's revenue, 14-day trend, payments split, gold sold, top category)
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAdminSalesSummary()
        {
            var response = await Mediator.Send(new GetAdminSalesSummaryQuery());
            return CreateResponse(response);
        }

        /// <summary>
        /// Get admin dashboard cash & used-gold snapshot (store/transfers box balances, gold on hand, gold bought today)
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAdminCashGoldSnapshot()
        {
            var response = await Mediator.Send(new GetAdminCashGoldSnapshotQuery());
            return CreateResponse(response);
        }

        /// <summary>
        /// Get admin dashboard repairs stats (collected today, in-progress/awaiting-call/due/overdue counts, unpaid balance)
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAdminRepairsStats()
        {
            var response = await Mediator.Send(new GetAdminRepairsStatsQuery());
            return CreateResponse(response);
        }

        /// <summary>
        /// Get admin dashboard inventory snapshot (stock value, refunds paid out today)
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAdminInventorySnapshot()
        {
            var response = await Mediator.Send(new GetAdminInventorySnapshotQuery());
            return CreateResponse(response);
        }

        /// <summary>
        /// Get admin dashboard "needs attention" items (overdue repairs, repairs awaiting call, returns needing tags)
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAdminAttentionItems()
        {
            var response = await Mediator.Send(new GetAdminAttentionItemsQuery());
            return CreateResponse(response);
        }
    }
}
