using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;

namespace JewerlyApp.Application.Carts.Commands.UpdateCart
{
    public class UpdateCartCommand : IRequest<GenericResponse<Guid>>
    {
        public decimal? Discount { get; set; }

        public DiscountType DiscountType { get; set; }
    }
}
