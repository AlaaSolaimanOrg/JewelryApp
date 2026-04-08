using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Products.Commands.MeltProduct
{
    public class MeltProductCommand : IRequest<GenericResponse<bool>>
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
