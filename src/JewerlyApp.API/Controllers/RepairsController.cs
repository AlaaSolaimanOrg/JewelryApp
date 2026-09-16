using JewerlyApp.Application.Repairs.Commands.CreateRepair;
using JewerlyApp.Application.Repairs.Commands.UpdateRepair;
using JewerlyApp.Application.Repairs.Commands.UpdateRepairStatus;
using JewerlyApp.Application.Repairs.Commands.UpdateRepairPaymentStatus;
using JewerlyApp.Application.Repairs.Queries.GetAvgRepairValueHistory;
using JewerlyApp.Application.Repairs.Queries.GetLongestInShop;
using JewerlyApp.Application.Repairs.Queries.GetRepairAlerts;
using JewerlyApp.Application.Repairs.Queries.GetRepairById;
using JewerlyApp.Application.Repairs.Queries.GetRepairHealthMetrics;
using JewerlyApp.Application.Repairs.Queries.GetRepairs;
using JewerlyApp.Application.Repairs.Queries.GetRepairsByCustomer;
using JewerlyApp.Application.Repairs.Queries.GetRepairsRevenueChart;
using JewerlyApp.Application.Repairs.Queries.GetRepairsStats;
using JewerlyApp.Application.Repairs.Queries.GetRepeatCustomers;
using Microsoft.AspNetCore.Mvc;

namespace JewerlyApp.API.Controllers
{
    [ApiController]
    public class RepairsController : MainController
    {
        [HttpPost]
        public async Task<IActionResult> CreateRepair([FromBody] CreateRepairCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetRepairs([FromQuery] GetRepairsQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetRepairById([FromQuery] GetRepairByIdQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateRepairStatus([FromBody] UpdateRepairStatusCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateRepairPaymentStatus([FromBody] UpdateRepairPaymentStatusCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateRepair([FromBody] UpdateRepairCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        /// <summary>
        /// get repair report stats (counts, revenue, unpaid, averages) for a date range
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetRepairsStats([FromQuery] GetRepairsStatsQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// get repair health metrics (on-time, collection, cancellation rates) for a date range
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetRepairHealthMetrics([FromQuery] GetRepairHealthMetricsQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// get repairs needing attention (overdue, ready to notify, or awaiting pickup) — always current
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetRepairAlerts()
        {
            var response = await Mediator.Send(new GetRepairAlertsQuery());
            return CreateResponse(response);
        }

        /// <summary>
        /// get completed-repair revenue bucketed by day/month/year for a date range
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetRepairsRevenueChart([FromQuery] GetRepairsRevenueChartQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// get repair revenue grouped by customer for a date range, optionally filtered by name
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetRepairsByCustomer([FromQuery] GetRepairsByCustomerQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// get average repair value by month, all time
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAvgRepairValueHistory()
        {
            var response = await Mediator.Send(new GetAvgRepairValueHistoryQuery());
            return CreateResponse(response);
        }

        /// <summary>
        /// get customers with more than one repair, all time
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetRepeatCustomers()
        {
            var response = await Mediator.Send(new GetRepeatCustomersQuery());
            return CreateResponse(response);
        }

        /// <summary>
        /// get active repairs (in progress or awaiting pickup) sorted by longest time in shop
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetLongestInShop()
        {
            var response = await Mediator.Send(new GetLongestInShopQuery());
            return CreateResponse(response);
        }
    }
}
