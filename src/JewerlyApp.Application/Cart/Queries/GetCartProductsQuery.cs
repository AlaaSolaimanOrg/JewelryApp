using JewerlyApp.Application.Common.Responses;
using MediatR;
using System.Collections.Generic;

namespace JewerlyApp.Application.Carts.Queries.GetCartProducts
{
    public class GetCartProductsQuery : IRequest<GenericResponse<List<GetCartProductsVM>>>
    {
    }
}
