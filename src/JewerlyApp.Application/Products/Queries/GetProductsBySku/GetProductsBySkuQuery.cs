using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace JewerlyApp.Application.Products.Queries.GetProducts
{
    public class GetProductsBySkuQuery : IRequest<GenericResponse<List<GetProductsVM>>>
    {
        [FromQuery(Name = "skus")]
        public List<string> skus { get; set; }
    }
}
