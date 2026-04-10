using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.Products.Queries.GetProductSpecialPricing
{
    public class GetProductSpecialPricingQuery : IRequest<GenericResponse<decimal?>>
    {
        public Guid ProductId { get; set; }
    }
}
