using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Products.Queries.GetProducts;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace JewerlyApp.Application.Products.Queries.GetProductsBySku
{
    public class GetProductsBySkusQuery : IRequest<GenericResponse<List<GetProductsVM>>>
    {
        //[FromQuery(Name = "skus")]
        public List<string> SKUs { get; set; } = new();
    }
}
