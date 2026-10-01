using JewerlyApp.Application.Customers.Commands.CreateCustomer;
using JewerlyApp.Application.Customers.Commands.DeleteCustomer;
using JewerlyApp.Application.Customers.Commands.UpdateCustomer;
using JewerlyApp.Application.Customers.Queries.GetAtRiskCustomers;
using JewerlyApp.Application.Customers.Queries.GetCustomer;
using JewerlyApp.Application.Customers.Queries.GetCustomerActivityStats;
using JewerlyApp.Application.Customers.Queries.GetCustomerBaseStats;
using JewerlyApp.Application.Customers.Queries.GetCustomerPurchaseHistory;
using JewerlyApp.Application.Customers.Queries.GetCustomers;
using JewerlyApp.Application.Customers.Queries.GetCustomerTiers;
using JewerlyApp.Application.Customers.Queries.GetNewCustomersChart;
using JewerlyApp.Application.Customers.Queries.GetTopCustomersReport;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace JewerlyApp.API.Controllers.Customers
{
    [Authorize]
    [ApiController]
    public class CustomerController : MainController
    {
        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCustomer([FromBody] UpdateCustomerCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteCustomer([FromBody] DeleteCustomerCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomers([FromQuery] GetCustomersQuery query) 
        {
            var response= await Mediator.Send(query);
            return CreateResponse(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomer([FromQuery] GetCustomerQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomerPurhcaseHistory([FromQuery] GetCustomerPurchaseHistoryQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// get customer-base stats (total, repeat rate, avg lifetime value, going quiet) — not period-filtered
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetCustomerBaseStats()
        {
            var response = await Mediator.Send(new GetCustomerBaseStatsQuery());
            return CreateResponse(response);
        }

        /// <summary>
        /// get customers grouped into spend tiers (VIP/Gold/Silver/Bronze/Regular), each with its top members
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetCustomerTiers()
        {
            var response = await Mediator.Send(new GetCustomerTiersQuery());
            return CreateResponse(response);
        }

        /// <summary>
        /// get high-value customers who haven't purchased in a while
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAtRiskCustomers()
        {
            var response = await Mediator.Send(new GetAtRiskCustomersQuery());
            return CreateResponse(response);
        }

        /// <summary>
        /// get active/new customer counts and new-vs-returning revenue for a date range
        /// </summary>
        /// <param name="query"></param>
        [HttpGet]
        public async Task<IActionResult> GetCustomerActivityStats([FromQuery] GetCustomerActivityStatsQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// get new-customer counts bucketed by day/month/year for a date range
        /// </summary>
        /// <param name="query"></param>
        [HttpGet]
        public async Task<IActionResult> GetNewCustomersChart([FromQuery] GetNewCustomersChartQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// get per-customer activity (purchases, items, spend, discount) for a date range, optionally filtered by name/phone
        /// </summary>
        /// <param name="query"></param>
        [HttpGet]
        public async Task<IActionResult> GetTopCustomersReport([FromQuery] GetTopCustomersReportQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }
    }
}
