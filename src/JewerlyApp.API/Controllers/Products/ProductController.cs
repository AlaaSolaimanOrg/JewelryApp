using JewerlyApp.Application.Products.Commands.CreateProduct;
using JewerlyApp.Application.Products.Commands.ValidateProductImages;
using JewerlyApp.Application.Products.Queries.GenerateSku;
using JewerlyApp.Application.Products.Queries.GetProducts;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JewerlyApp.API.Controllers.Products
{

    public class ProductController : MainController
    {        

        /// <summary>
        /// Generate product SKU
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GenerateSku([FromQuery] GenerateSkuQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// Validate product images
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> ValidateProductImages([FromForm] ValidateProductImagesCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
        
        /// <summary>
        /// Create product
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] CreateProductCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
        
        /// <summary>
        /// Create product
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] GetProductsQuery command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
    }
}
