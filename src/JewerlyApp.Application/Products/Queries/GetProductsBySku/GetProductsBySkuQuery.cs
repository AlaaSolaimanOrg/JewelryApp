using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Products.Queries.GetProducts;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace JewerlyApp.Application.Products.Queries.GetProductsBySku
{
    public class GetProductsBySkuQuery : IRequest<GenericResponse<List<GetProductsVM>>>
    {
        [FromQuery(Name = "skus")]
        public List<string> skus { get; set; }
    }
}
