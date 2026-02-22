using JewerlyApp.Application.Auth.Commands.RefreshToken;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using JewerlyApp.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Infrastructure.Services
{
    public class JwtTokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<JwtTokenService> _logger;

        public JwtTokenService(IConfiguration configuration, UserManager<ApplicationUser> userManager, ILogger<JwtTokenService> logger)
        {
            _configuration = configuration;
            _userManager = userManager;
            _logger = logger;
        }

        public GenericResponse<string> GenerateAccessToken(int userId, string username, IList<string> roles)
        {
            try
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                    new Claim(ClaimTypes.Name, username ?? string.Empty),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                // Add role claims for role-based authorization
                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Secret"]!));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["JwtSettings:AccessTokenExpiryMinutes"] ?? "60"));

                var token = new JwtSecurityToken(
                    issuer: _configuration["JwtSettings:Issuer"],
                    audience: _configuration["JwtSettings:Audience"],
                    claims: claims,
                    expires: expires,
                    signingCredentials: creds
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                return new GenericResponse<string>
                {
                    StatusCode = ResponseStatusCode.Success,
                    Data = tokenString,
                    Message = Messages.Success_Token_Generated
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate access token for user {UserId}", userId);
                return Error<string>(ResponseStatusCode.InternalServerError, Messages.Error_Token_Generation);
            }
        }

        public ClaimsPrincipal? ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:Secret"]);

            try
            {
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _configuration["JwtSettings:Issuer"],
                    ValidAudience = _configuration["JwtSettings:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.Zero
                }, out var validatedToken);

                return principal;
            }
            catch
            {
                return null;
            }
        }

        public async Task<GenericResponse<string>> GenerateRefreshToken(int userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    _logger.LogWarning("User with ID {UserId} not found for refresh token generation", userId);
                    return Error<string>(ResponseStatusCode.NotFound, Messages.Error_User_Not_Found);
                }

                if (!user.IsActive)
                {
                    _logger.LogWarning("Inactive user account {UserId} attempted refresh token generation", userId);
                    return Error<string>(ResponseStatusCode.Unauthorized, Messages.Error_User_Inactive);
                }

                var randomNumber = new byte[32];
                using var rng = RandomNumberGenerator.Create();
                rng.GetBytes(randomNumber);

                var refreshToken = Convert.ToBase64String(randomNumber);

                // Store refresh token with expiry
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(
                    Convert.ToDouble(_configuration["JwtSettings:RefreshTokenExpiryDays"] ?? "7")
                );

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    _logger.LogError("Failed to update user {UserId} with refresh token: {Errors}", userId, string.Join(", ", errors));

                    return Error<string>(
                        ResponseStatusCode.InternalServerError,
                        Messages.Error_Refresh_Token_Save,
                        errors
                    );
                }

                return new GenericResponse<string>
                {
                    StatusCode = ResponseStatusCode.Success,
                    Data = refreshToken,
                    Message = Messages.Success_Refresh_Token_Generated
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error generating refresh token for user {UserId}", userId);
                return Error<string>(ResponseStatusCode.InternalServerError, Messages.Error_Refresh_Token_Generation);
            }
        }

        public async Task<GenericResponse<RefreshTokenVM>> RefreshTokens(string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
            {
                _logger.LogWarning("Refresh token is null or empty");
                return Error<RefreshTokenVM>(ResponseStatusCode.BadRequest, Messages.Error_Refresh_Token_Required);
            }

            try
            {
                // Find user with matching valid refresh token
                var user = await _userManager.Users
                    .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken &&
                                             u.RefreshTokenExpiry > DateTime.UtcNow &&
                                             u.IsActive);

                if (user == null)
                {
                    _logger.LogWarning("Invalid or expired refresh token provided");
                    return Error<RefreshTokenVM>(ResponseStatusCode.Unauthorized, Messages.Error_Refresh_Token_Expired);
                }

                var roles = await _userManager.GetRolesAsync(user);

                // Generate new access token
                var accessTokenResponse = GenerateAccessToken(user.Id, user.UserName!, roles);
                if (accessTokenResponse.StatusCode != ResponseStatusCode.Success)
                {
                    return new GenericResponse<RefreshTokenVM>
                    {
                        StatusCode = accessTokenResponse.StatusCode,
                        Message = accessTokenResponse.Message,
                        Errors = accessTokenResponse.Errors
                    };
                }

                // Generate new refresh token (this will replace the old one)
                var refreshTokenResponse = await GenerateRefreshToken(user.Id);
                if (refreshTokenResponse.StatusCode != ResponseStatusCode.Success)
                {
                    return new GenericResponse<RefreshTokenVM>
                    {
                        StatusCode = refreshTokenResponse.StatusCode,
                        Message = refreshTokenResponse.Message,
                        Errors = refreshTokenResponse.Errors
                    };
                }

                return new GenericResponse<RefreshTokenVM>
                {
                    StatusCode = ResponseStatusCode.Success,
                    Data = new RefreshTokenVM
                    {
                        AccessToken = accessTokenResponse.Data!,
                        RefreshToken = refreshTokenResponse.Data!
                    },
                    Message = Messages.Success_Tokens_Refreshed
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error refreshing tokens");
                return Error<RefreshTokenVM>(ResponseStatusCode.InternalServerError, Messages.ErrorGeneral);
            }
        }

        public async Task<GenericResponse<bool>> RevokeRefreshToken(int userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    return Error<bool>(ResponseStatusCode.NotFound, Messages.Error_User_Not_Found);
                }

                user.RefreshToken = null;
                user.RefreshTokenExpiry = null;

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    _logger.LogError("Failed to revoke refresh token for user {UserId}: {Errors}", userId, string.Join(", ", errors));

                    return Error<bool>(
                        ResponseStatusCode.InternalServerError,
                        Messages.Error_Token_Revoke,
                        errors
                    );
                }

                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.Success,
                    Data = true,
                    Message = Messages.Success_Token_Revoked
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error revoking refresh token for user {UserId}", userId);
                return Error<bool>(ResponseStatusCode.InternalServerError, Messages.Error_Token_Revoke);
            }
        }

        public async Task<GenericResponse<bool>> ValidateRefreshToken(string refreshToken, int userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null || !user.IsActive)
                {
                    return Error<bool>(ResponseStatusCode.NotFound, Messages.Error_User_Not_Found);
                }

                var isValid = user.RefreshToken == refreshToken &&
                             user.RefreshTokenExpiry > DateTime.UtcNow;

                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.Success,
                    Data = isValid,
                    Message = isValid ? Messages.Success_Token_Valid : Messages.Success_Token_Invalid
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating refresh token");
                return Error<bool>(ResponseStatusCode.InternalServerError, Messages.Error_Token_Validation);
            }
        }

        public async Task<GenericResponse<int>> CleanExpiredRefreshTokens()
        {
            try
            {
                var expiredUsers = await _userManager.Users
                    .Where(u => u.RefreshTokenExpiry < DateTime.UtcNow && u.RefreshToken != null)
                    .ToListAsync();

                int cleanedCount = 0;
                foreach (var user in expiredUsers)
                {
                    user.RefreshToken = null;
                    user.RefreshTokenExpiry = null;
                    cleanedCount++;
                }

                // Save changes for all users (you might want to batch this for large datasets)
                if (expiredUsers.Any())
                {
                    foreach (var user in expiredUsers)
                    {
                        await _userManager.UpdateAsync(user);
                    }
                }

                return new GenericResponse<int>
                {
                    StatusCode = ResponseStatusCode.Success,
                    Data = cleanedCount,
                    Message = Messages.Success_Action
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cleaning expired refresh tokens");
                return Error<int>(ResponseStatusCode.InternalServerError, Messages.Error_Token_Cleanup);
            }
        }

        // Static Error method without ErrorCode
        private static GenericResponse<T> Error<T>(ResponseStatusCode statusCode, string message, List<string>? errors = null)
        {
            return new GenericResponse<T>
            {
                StatusCode = statusCode,
                Message = message,
                Errors = errors ?? new List<string>()
            };
        }
    }
}
