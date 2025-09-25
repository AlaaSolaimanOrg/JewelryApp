using JewerlyApp.Application.Auth.Queries.GetAllUsers;
using JewerlyApp.Application.Common.Dtos;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace JewerlyApp.API.Controllers.Identity
{
    public class UsersController : MainController
    {
        private readonly IUserManagementService _userManagementService;

        public UsersController(IUserManagementService userManagementService)
        {
            _userManagementService = userManagementService;
        }

        /// <summary>
        /// Create a new user
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
        {
            var response = await _userManagementService.CreateUserAsync(request);
            return CreateResponse(response);
        }

        /// <summary>
        /// Update user details
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPut("{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUser(int userId, [FromBody] UpdateUserRequest request)
        {
            var response = await _userManagementService.UpdateUserAsync(userId, request);
            return CreateResponse(response);
        }

        /// <summary>
        /// Soft delete a user
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpDelete("{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SoftDeleteUser(int userId)
        {
            var response = await _userManagementService.SoftDeleteUserAsync(userId);
            return CreateResponse(response);
        }

        /// <summary>
        /// Restore a soft-deleted user
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpPatch("{userId}/restore")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RestoreUser(int userId)
        {
            var response = await _userManagementService.RestoreUserAsync(userId);
            return CreateResponse(response);
        }

        /// <summary>
        /// Get user by ID
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        [HttpGet("{userId}")]
        [Authorize(Roles = "Admin,PosRole")]
        public async Task<IActionResult> GetUserById(int userId)
        {
            var response = await _userManagementService.GetUserByIdAsync(userId);
            return CreateResponse(response);
        }

        /// <summary>
        /// Get all users
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers([FromQuery] GetAllUsersQuery query)
        {
            var response = await Mediator.Send(query);
            return CreateResponse(response);
        }

        /// <summary>
        /// Get all available roles in the system
        /// </summary>
        /// <returns></returns>
        [HttpGet("roles")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllRoles()
        {
            var response = await _userManagementService.GetAllRolesAsync();
            return CreateResponse(response);
        }

        /// <summary>
        /// Get roles for a specific user
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>List of user roles</returns>
        [HttpGet]
        [Authorize(Roles = "Admin,PosRole")]
        public async Task<IActionResult> GetUserInfo()
        {
            var response = await _userManagementService.GetUserInfoAsync();
            return CreateResponse(response);
        }

        // NEW METHODS ADDED:

        /// <summary>
        /// Assign roles to a user
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <param name="roles">List of roles to assign</param>
        [HttpPost("{userId}/roles/assign")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignRolesToUser(int userId, [FromBody] List<string> roles)
        {
            var response = await _userManagementService.AssignRolesToUserAsync(userId, roles);
            return CreateResponse(response);
        }

        /// <summary>
        /// Remove roles from a user
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <param name="roles">List of roles to remove</param>
        [HttpPost("{userId}/roles/remove")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RemoveRolesFromUser(int userId, [FromBody] List<string> roles)
        {
            var response = await _userManagementService.RemoveRolesFromUserAsync(userId, roles);
            return CreateResponse(response);
        }

        /// <summary>
        /// Reset user password (admin function)
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <param name="request">New password request</param>
        [HttpPost("{userId}/reset-password")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResetUserPassword(int userId, [FromBody] ResetPasswordRequest request)
        {
            var response = await _userManagementService.ResetUserPasswordAsync(userId, request.NewPassword);
            return CreateResponse(response);
        }

        /// <summary>
        /// Create a new role
        /// </summary>
        /// <param name="request">Role creation request</param>
        [HttpPost("roles")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleRequest request)
        {
            var response = await _userManagementService.CreateRoleAsync(request.RoleName, request.Description);
            return CreateResponse(response);
        }

        /// <summary>
        /// Update a role
        /// </summary>
        /// <param name="currentRoleName">Current role name</param>
        /// <param name="request">Role update request</param>
        [HttpPut("roles/{currentRoleName}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateRole(string currentRoleName, [FromBody] UpdateRoleRequest request)
        {
            var response = await _userManagementService.UpdateRoleAsync(currentRoleName, request.NewRoleName, request.Description);
            return CreateResponse(response);
        }

        /// <summary>
        /// Delete a role
        /// </summary>
        /// <param name="roleName">Role name to delete</param>
        [HttpDelete("roles/{roleName}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteRole(string roleName)
        {
            var response = await _userManagementService.DeleteRoleAsync(roleName);
            return CreateResponse(response);
        }
    }

    // DTOs for the new methods
    public class ResetPasswordRequest
    {
        public string NewPassword { get; set; } = string.Empty;
    }

    public class CreateRoleRequest
    {
        public string RoleName { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class UpdateRoleRequest
    {
        public string NewRoleName { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}