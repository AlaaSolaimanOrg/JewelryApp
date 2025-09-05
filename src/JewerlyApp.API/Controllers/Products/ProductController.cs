using JewerlyApp.Application.Products.Commands.CreateProduct;
using JewerlyApp.Application.Products.Commands.DeleteProduct;
using JewerlyApp.Application.Products.Commands.EditProduct;
using JewerlyApp.Application.Products.Commands.ValidateProductImages;
using JewerlyApp.Application.Products.Queries.GenerateSku;
using JewerlyApp.Application.Products.Queries.GetProducts;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

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
        [HttpPost("create")]
        public async Task<IActionResult> CreateProduct([FromForm] CreateProductCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        /// <summary>
        /// Edit product
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPut("edit")]
        public async Task<IActionResult> EditProduct([FromForm] EditProductCommand command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        /// <summary>
        /// Get all products with optional filters
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] GetProductsQuery command)
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        /// <summary>
        /// Delete product by ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            var command = new DeleteProductCommand
            {
                Id = id
            };
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }

        /// <summary>
        /// Get product by ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(Guid id)
        {
            var query = new GetProductByIdQuery(id);
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }
    }
}
