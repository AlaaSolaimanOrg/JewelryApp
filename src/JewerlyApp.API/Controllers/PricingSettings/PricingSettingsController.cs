using JewerlyApp.Application.PricingSettings.Queries.GetGlobalPricingSettings;
using JewerlyApp.Application.Products.Queries.GenerateSku;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using JewerlyApp.Application.PricingSettings.Queries;
using MediatR;
using System.Threading.Tasks;
using JewerlyApp.Application.Products.Commands.EditPricingSettings;
using JewerlyApp.Application.PricingSettings.Queries.GetPricingSettings;
using Microsoft.AspNetCore.Authorization;

namespace JewerlyApp.API.Controllers.PricingSettings
{
    public class PricingSettingsController : MainController
    {
        /// <summary>
        /// Get all global pricing settings per metal
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = ("Admin"))]
        public async Task<IActionResult> GetGlobalPricingSettings([FromQuery] GetGlobalPricingSettingsQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EditPricingSettings([FromBody] EditPricingSettingsCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPricingSettings([FromQuery] GetPricingSettingsQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }
    }
}
