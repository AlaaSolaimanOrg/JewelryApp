using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Carts.Commands.RemoveProductFromCart
{
    public class RemoveProductFromCartCommand : IRequest<GenericResponse<string>>
    {
        public Guid ProductId {  get; set; }
    }
}
