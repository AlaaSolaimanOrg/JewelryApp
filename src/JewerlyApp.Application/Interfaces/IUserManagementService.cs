using JewerlyApp.Application.Auth.Queries.GetAllUsers;
using JewerlyApp.Application.Common.Dtos;
using JewerlyApp.Application.Common.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Interfaces
{
    public interface IUserManagementService
    {
        Task<GenericResponse<UserDto>> CreateUserAsync(CreateUserRequest request);
        Task<GenericResponse<UserDto>> UpdateUserAsync(int userId, UpdateUserRequest request);
        Task<GenericResponse<bool>> SoftDeleteUserAsync(int userId);
        Task<GenericResponse<UserDto>> GetUserByIdAsync(int userId);
        Task<PaginatedResponse<UserDto>> GetAllUsersAsync(GetAllUsersQuery query, CancellationToken cancellationToken);
        Task<GenericResponse<bool>> RestoreUserAsync(int userId);
        Task<GenericResponse<List<string>>> GetAllRolesAsync();
        Task<GenericResponse<UserDto>> GetUserInfoAsync();

        Task<GenericResponse<bool>> AssignRolesToUserAsync(int userId, List<string> roles);
        Task<GenericResponse<bool>> RemoveRolesFromUserAsync(int userId, List<string> roles);
        Task<GenericResponse<bool>> ResetUserPasswordAsync(int userId, string newPassword);
        Task<GenericResponse<bool>> CreateRoleAsync(string roleName, string? description = null);
        Task<GenericResponse<bool>> UpdateRoleAsync(string currentRoleName, string newRoleName, string? description = null);
        Task<GenericResponse<bool>> DeleteRoleAsync(string roleName);
    }
}
