using JewerlyApp.Application.PricingSettings.Queries.GetGlobalPricingSettings;
using JewerlyApp.Application.Products.Queries.GenerateSku;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JewerlyApp.API.Controllers.PricingSettings
{
    public class PricingSettingsController : MainController
    {
        /// <summary>
        /// Get Global Pricing Settings per metal
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetGlobalPricingSettings([FromQuery] GetGlobalPricingSettingsQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }
    }
}
