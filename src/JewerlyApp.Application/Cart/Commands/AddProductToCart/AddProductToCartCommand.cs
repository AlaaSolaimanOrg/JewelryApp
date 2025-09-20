using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Carts.Commands.AddProductToCart
{
    public class AddProductToCartCommand : IRequest<GenericResponse<string>>
    {
        public Guid ProductId { get; set; }
    }
}
