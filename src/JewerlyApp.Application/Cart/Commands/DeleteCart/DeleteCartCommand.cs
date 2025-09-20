using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Carts.Commands.DeleteCart
{
    public class DeleteCartCommand : IRequest<GenericResponse<Guid>>
    {

    }
}
