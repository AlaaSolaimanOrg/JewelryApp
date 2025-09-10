using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;
using System.ComponentModel.DataAnnotations;

namespace JewerlyApp.Application.Products.Commands.EditPricingSettings
{
    public class EditPricingSettingsCommand : IRequest<GenericResponse<bool>>
    {   
        public ProductType ProductType { get; set; }
        public KaratType KaratType { get; set; }
        public decimal PricePerGram{ get; set; }
    }
}
