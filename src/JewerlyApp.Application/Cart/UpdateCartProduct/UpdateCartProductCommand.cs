using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;

namespace JewerlyApp.Application.Carts.Commands.UpdateCartProduct
{
    public class UpdateCartProductCommand : IRequest<GenericResponse<string>>
    {
        public Guid ProductId { get; set; }
        public decimal Discount { get; set; }
        public DiscountType DiscountType { get; set; }
    }
}
