using JewerlyApp.Application.Repairs.Commands.CreateRepair;
using JewerlyApp.Application.Repairs.Commands.UpdateRepair;
using JewerlyApp.Application.Repairs.Commands.UpdateRepairItem;
using JewerlyApp.Application.Repairs.Commands.UpdateRepairStatus;
using JewerlyApp.Application.Repairs.Queries.GetAnalytics;
using JewerlyApp.Application.Repairs.Queries.GetRepairById;
using JewerlyApp.Application.Repairs.Queries.GetRepairs;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

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
        public async Task<IActionResult> UpdateRepair([FromBody] UpdateRepairCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateRepairItem([FromBody] UpdateRepairItemCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetRepairAnalytics([FromQuery] GetRepairAnalyticsQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }
    }
}
