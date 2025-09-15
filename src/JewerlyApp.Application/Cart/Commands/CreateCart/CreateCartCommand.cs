using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Carts.Commands.CreateCart
{
    public class CreateCartCommand : IRequest<GenericResponse<string>>
    {
        // The class is empty as no input is required from the client.
    }
}
