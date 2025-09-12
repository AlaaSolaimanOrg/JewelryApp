using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;

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
            var accessTokenResult =  _tokenService.GenerateAccessToken(validation.Data.UserId, validation.Data.UserName, validation.Data.Roles);

            if (accessTokenResult.StatusCode != ResponseStatusCode.Success)
            {
                return new GenericResponse<LoginResponse>
                {
                    Data = null,
                    StatusCode = accessTokenResult.StatusCode,
                    Message = accessTokenResult.Message,
                };
            }
            
            var refreshTokenResult = await _tokenService.GenerateRefreshToken(validation.Data.UserId);

            if (refreshTokenResult.StatusCode != ResponseStatusCode.Success)
            {
                return new GenericResponse<LoginResponse>
                {
                    Data = null,
                    StatusCode = refreshTokenResult.StatusCode,
                    Message = refreshTokenResult.Message,
                };
            }

            var result = new LoginResponse
            {
                AccessToken = accessTokenResult.Data!,
                ExpiresAt = DateTime.UtcNow,
                RefreshToken = refreshTokenResult.Data!,
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
