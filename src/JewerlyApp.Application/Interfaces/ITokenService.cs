using JewerlyApp.Application.Common.Identity;
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
        Task<string> GenerateAccessToken(int userId);
        Task<string> GenerateRefreshToken();
        ClaimsPrincipal? ValidateToken(string token);
    }
}
