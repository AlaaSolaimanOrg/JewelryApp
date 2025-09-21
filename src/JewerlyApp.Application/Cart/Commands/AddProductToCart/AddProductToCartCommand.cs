using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.ComponentModel.DataAnnotations;

namespace JewerlyApp.Application.Carts.Commands.AddProductToCart
{
    public class AddProductToCartCommand : IRequest<GenericResponse<string>>
    {
        [Required]
        public Guid ProductId { get; set; }
        public decimal Price { get; set; }
    }
}
