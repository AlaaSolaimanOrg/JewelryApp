using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.Products.Commands.UpsertProductSpecialPricing
{
    public class UpsertProductSpecialPricingCommand : IRequest<GenericResponse<bool>>
    {
        public Guid ProductId { get; set; }
        public decimal SpecialPricePerGram { get; set; }
    }
}
