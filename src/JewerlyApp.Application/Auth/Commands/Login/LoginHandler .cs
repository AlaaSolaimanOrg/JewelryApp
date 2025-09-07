using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Auth.Commands.Login
{
    public class LoginHandler : IRequestHandler<LoginCommand, GenericResponse<LoginResponse>>
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        public LoginHandler(IUserService userService, ITokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        public async Task<GenericResponse<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var validation = await _userService.ValidateUserAsync(request.Username, request.Password);

            if (validation.StatusCode != ResponseStatusCode.Success)
                return new GenericResponse<LoginResponse>
                {
                    Data = null,
                    StatusCode = validation.StatusCode,
                    Message = validation.Message
                };

            // Generate JWT
            var token = await _tokenService.GenerateAccessToken(validation.Data);
            var result = new LoginResponse
            {
                AccessToken = token,
                ExpiresAt = DateTime.UtcNow,
                RefreshToken = ""
            };

            return new GenericResponse<LoginResponse>
            {
                Data = result,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.SuccessLogin
            };
        }
    }
}
