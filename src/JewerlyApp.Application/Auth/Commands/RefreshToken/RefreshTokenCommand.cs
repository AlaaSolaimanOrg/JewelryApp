using JewerlyApp.Application.Auth.Commands.Login;
using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Auth.Commands.RefreshToken
{
    public class RefreshTokenCommand : IRequest<GenericResponse<RefreshTokenVM>>
    {
        public string RefreshToken { get; set; } = string.Empty;
    }
}
