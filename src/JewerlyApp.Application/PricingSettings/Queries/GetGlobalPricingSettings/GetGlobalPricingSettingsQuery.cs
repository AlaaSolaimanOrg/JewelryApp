using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Products.Queries.GetProducts;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.PricingSettings.Queries.GetGlobalPricingSettings
{
    public class GetGlobalPricingSettingsQuery : IRequest<GenericResponse<GetGlobalPricingSettingsVM>>
    {
        [Required]
        public ProductType ProductType { get; set; }
        [Required]
        public Currency Currency { get; set; }

    }
}
