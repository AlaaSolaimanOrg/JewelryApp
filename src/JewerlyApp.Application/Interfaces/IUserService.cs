using JewerlyApp.Application.Common.Dtos;
using JewerlyApp.Application.Common.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Interfaces
{
    public interface IUserService
    {
        Task<GenericResponse<(int UserId, string UserName, IList<string> Roles)>> ValidateUserAsync(string username, string password);
        Task<bool> IsInRoleAsync(int userId, string roleName);
        Task<UserDto> GetLoggedInUser();
    }
}
