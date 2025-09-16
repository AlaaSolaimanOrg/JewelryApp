using JewerlyApp.Application.Carts.Commands.AddProductToCart;
using JewerlyApp.Application.Carts.Commands.CreateCart;
using JewerlyApp.Application.Carts.Commands.DeleteCart;
using JewerlyApp.Application.Carts.Commands.RemoveProductFromCart;
using JewerlyApp.Application.Carts.Commands.UpdateCart;
using JewerlyApp.Application.Carts.Queries.GetCartProducts;
using JewerlyApp.Application.Products.Commands.CreateProduct;
using JewerlyApp.Application.Products.Commands.DeleteProduct;
using JewerlyApp.Application.Products.Commands.EditProduct;
using JewerlyApp.Application.Products.Commands.ValidateProductImages;
using JewerlyApp.Application.Products.Queries.GenerateSku;
using JewerlyApp.Application.Products.Queries.GetProducts;
using JewerlyApp.Application.Products.Queries.GetQueryById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace JewerlyApp.API.Controllers.Cart
{
    public class CartController : MainController
    {
        [HttpPost]
        public async Task<IActionResult> CreateCart([FromBody] CreateCartCommand command) 
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
        [HttpPost]
        public async Task<IActionResult> AddProductToCart([FromBody] AddProductToCartCommand command) 
        {
            var response= await Mediator.Send(command);
            return CreateResponse(response);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteCart([FromBody] DeleteCartCommand command) 
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
        [HttpPut]
        public async Task<IActionResult> UpdateCart([FromBody] UpdateCartCommand command)
        {
            var response=await Mediator.Send(command);
            return CreateResponse(response);
        }
        [HttpPost]
        public async Task<IActionResult> RemoveProductFromCart([FromBody] RemoveProductFromCartCommand command) 
        {
            var response = await Mediator.Send(command);
            return CreateResponse(response);
        }
        [HttpGet]
        public async Task<IActionResult> GetCartProducts([FromQuery] GetCartProductsQuery query) 
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

    }
}
