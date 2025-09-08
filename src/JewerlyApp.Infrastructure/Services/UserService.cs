using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using JewerlyApp.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UserService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
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
    }
}
