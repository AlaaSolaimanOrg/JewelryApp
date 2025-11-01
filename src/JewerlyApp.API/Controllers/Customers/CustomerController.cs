using JewerlyApp.Application.Customers.Commands.CreateCustomer;
using JewerlyApp.Application.Customers.Commands.DeleteCustomer;
using JewerlyApp.Application.Customers.Commands.UpdateCustomer;
using JewerlyApp.Application.Customers.Queries.GetCustomer;
using JewerlyApp.Application.Customers.Queries.GetCustomerPurchaseHistory;
using JewerlyApp.Application.Customers.Queries.GetCustomers;
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
    }
}
