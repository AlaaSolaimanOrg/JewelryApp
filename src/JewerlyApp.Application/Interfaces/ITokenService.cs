using JewerlyApp.Application.Auth.Commands.RefreshToken;
using JewerlyApp.Application.Common.Identity;
using JewerlyApp.Application.Common.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Interfaces
{
    public interface ITokenService
    {
        GenericResponse<string> GenerateAccessToken(int userId, string username, IList<string> roles);
        Task<GenericResponse<string>> GenerateRefreshToken(int userId);
        ClaimsPrincipal? ValidateToken(string token);
        Task<GenericResponse<RefreshTokenVM>> RefreshTokens(string refreshToken);
        Task<GenericResponse<bool>> RevokeRefreshToken(int userId);
        Task<GenericResponse<bool>> ValidateRefreshToken(string refreshToken, int userId);
        Task<GenericResponse<int>> CleanExpiredRefreshTokens();
    }
}
