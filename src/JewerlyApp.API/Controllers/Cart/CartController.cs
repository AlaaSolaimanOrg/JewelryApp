using JewerlyApp.Application.Carts.Commands.CreateCart;
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
    }
}
