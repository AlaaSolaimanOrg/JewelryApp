using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.Products.Queries.GetBullionProducts
{
    public class GetBullionProductsQuery : IRequest<GenericResponse<BullionProductsVM>>
    {
    }
}
