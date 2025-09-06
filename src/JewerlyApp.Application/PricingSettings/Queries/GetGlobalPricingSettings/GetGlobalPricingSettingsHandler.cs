using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Products.Queries.GetProducts;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace JewerlyApp.Application.PricingSettings.Queries.GetGlobalPricingSettings
{
    internal class GetGlobalPricingSettingsHandler : IRequestHandler<GetGlobalPricingSettingsQuery, GenericResponse<GetGlobalPricingSettingsVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetGlobalPricingSettingsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<GetGlobalPricingSettingsVM>> Handle(GetGlobalPricingSettingsQuery request, CancellationToken cancellationToken)
        {
            string apiKey = "goldapi-euptlsmf86umr8-io";
            string symbol = request.ProductType == ProductType.Gold ? "XAU" : "XAG";
            string curr = request.Currency.ToString();
            string date = "";
            GetGlobalPricingSettingsVM? goldPrices = new();


            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("x-access-token", apiKey);
                //client.DefaultRequestHeaders.Add("Content-Type", "application/json");

                string url = $"https://www.goldapi.io/api/{symbol}/{curr}{date}";

                try
                {
                    HttpResponseMessage response = await client.GetAsync(url);
                    response.EnsureSuccessStatusCode();

                    string result = await response.Content.ReadAsStringAsync();

                    // Deserialize only the needed fields
                    goldPrices = JsonSerializer.Deserialize<GetGlobalPricingSettingsVM>(result, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    


                    
                }
                catch (Exception ex)
                {
                    return new GenericResponse<GetGlobalPricingSettingsVM>
                    {
                        Data = null,
                        StatusCode = ResponseStatusCode.InternalServerError,
                        Message = ex.Message,
                    };
                }
            }
            goldPrices!.ProductType = request.ProductType.ToString();
            return new GenericResponse<GetGlobalPricingSettingsVM>
            {
                Data = goldPrices,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
