using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Auth.Commands.RefreshToken
{
    public class RefreshTokenHandler : IRequestHandler<RefreshTokenCommand, GenericResponse<RefreshTokenVM>>
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;
        private readonly IApplicationDbContext _context;

        public RefreshTokenHandler(IUserService userService, ITokenService tokenService, IApplicationDbContext context)
        {
            _userService = userService;
            _tokenService = tokenService;
            _context = context;
        }

        public async Task<GenericResponse<RefreshTokenVM>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {
            var tokensResult = await _tokenService.RefreshTokens(request.RefreshToken);

            if (tokensResult.StatusCode != ResponseStatusCode.Success)
            {
                return new GenericResponse<RefreshTokenVM>
                {
                    Data = null,
                    StatusCode = tokensResult.StatusCode,
                    Message = tokensResult.Message,
                };
            }

            var tokens = new RefreshTokenVM
            {
                AccessToken = tokensResult.Data!.AccessToken,
                RefreshToken = tokensResult.Data.RefreshToken,
            };

            return new GenericResponse<RefreshTokenVM>
            {
                Data = tokens,
                StatusCode = Domain.Enums.ResponseStatusCode.Success,
                Message = Messages.Success_Action,
            };
        }
    }
}
