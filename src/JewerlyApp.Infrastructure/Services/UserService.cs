using JewerlyApp.Application.Common.Dtos;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using JewerlyApp.Infrastructure.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(UserManager<ApplicationUser> userManager, IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<GenericResponse<(int UserId, string UserName, IList<string> Roles)>> ValidateUserAsync(string username, string password)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return new GenericResponse<(int, string, IList<string>)>
                {
                    Data = default,
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = "Invalid username"
                };
            }

            var passwordValid = await _userManager.CheckPasswordAsync(user, password);
            if (!passwordValid)
            {
                return new GenericResponse<(int, string, IList<string>)>
                {
                    Data = default,
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = "Invalid password"
                };
            }

            // Get roles
            var roles = await _userManager.GetRolesAsync(user);

            return new GenericResponse<(int, string, IList<string>)>
            {
                Data = (user.Id, user.UserName!, roles),
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }

        public async Task<bool> IsInRoleAsync(int userId, string roleName)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return false;

            return await _userManager.IsInRoleAsync(user, roleName);
        }
        public async Task<UserDto?> GetLoggedInUser()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == 0)
                {
                    return null;
                }

                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null || !user.IsActive)
                {
                    return null;
                }

                var roles = await _userManager.GetRolesAsync(user);

                return new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName!,
                    Email = user.Email!,
                    FullName = user.FullName,
                    PhoneNumber = user.PhoneNumber,
                    Roles = roles.ToList(),
                    IsActive = user.IsActive
                };
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public int GetCurrentUserId()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return 0;
            }
            return userId;
        }
    }
}
