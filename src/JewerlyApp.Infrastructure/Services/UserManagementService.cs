using JewerlyApp.Application.Auth.Queries.GetAllUsers;
using JewerlyApp.Application.Common.Dtos;
using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Products.Queries.GetProducts;
using JewerlyApp.Domain.Enums;
using JewerlyApp.Infrastructure.Context;
using JewerlyApp.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Infrastructure.Services
{
    public class UserManagementService : IUserManagementService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IUserService _userService;
        private readonly ApplicationDbContext _context;

        public UserManagementService(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, IUserService userService, ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _userService = userService;
            _context = context;
        }

        public async Task<GenericResponse<UserDto>> CreateUserAsync(CreateUserRequest request)
        {
            try
            {
                var existingUser = await _userManager.FindByNameAsync(request.UserName);
                if (existingUser != null)
                {
                    return new GenericResponse<UserDto>
                    {
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_User_Already_Exists
                    };
                }

                var user = new ApplicationUser
                {
                    UserName = request.UserName,
                    Email = request.Email,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await _userManager.CreateAsync(user, request.Password);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    return new GenericResponse<UserDto>
                    {
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_User_Creation_Failed,
                        Errors = errors
                    };
                }

                if (request.Roles != null && request.Roles.Any())
                {
                    var roleResult = await _userManager.AddToRolesAsync(user, request.Roles);
                    if (!roleResult.Succeeded)
                    {
                        var errors = roleResult.Errors.Select(e => e.Description).ToList();
                        return new GenericResponse<UserDto>
                        {
                            StatusCode = ResponseStatusCode.BadRequest,
                            Message = Messages.Error_User_Role_Assignment_Failed,
                            Errors = errors
                        };
                    }
                }

                var roles = await _userManager.GetRolesAsync(user);
                return new GenericResponse<UserDto>
                {
                    StatusCode = ResponseStatusCode.Created,
                    Data = MapToUserDto(user, roles),
                    Message = Messages.Success_User_Created
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<UserDto>
                {
                    StatusCode = ResponseStatusCode.InternalServerError,
                    Message = Messages.ErrorGeneral
                };
            }
        }

        public async Task<GenericResponse<UserDto>> UpdateUserAsync(int userId, UpdateUserRequest request)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    return new GenericResponse<UserDto>
                    {
                        StatusCode = ResponseStatusCode.NotFound,
                        Message = Messages.Error_User_Not_Found
                    };
                }

                if (!string.IsNullOrEmpty(request.UserName))
                    user.UserName = request.UserName;

                if (!string.IsNullOrEmpty(request.Email))
                    user.Email = request.Email;

                if (request.IsActive.HasValue)
                    user.IsActive = request.IsActive.Value;

                user.UpdatedAt = DateTime.UtcNow;

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    return new GenericResponse<UserDto>
                    {
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_User_Update_Failed,
                        Errors = errors
                    };
                }

                if (request.Roles != null)
                {
                    var currentRoles = await _userManager.GetRolesAsync(user);
                    var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                    if (!removeResult.Succeeded)
                    {
                        var errors = removeResult.Errors.Select(e => e.Description).ToList();
                        return new GenericResponse<UserDto>
                        {
                            StatusCode = ResponseStatusCode.BadRequest,
                            Message = Messages.Error_User_Role_Update_Failed,
                            Errors = errors
                        };
                    }

                    var addResult = await _userManager.AddToRolesAsync(user, request.Roles);
                    if (!addResult.Succeeded)
                    {
                        var errors = addResult.Errors.Select(e => e.Description).ToList();
                        return new GenericResponse<UserDto>
                        {
                            StatusCode = ResponseStatusCode.BadRequest,
                            Message = Messages.Error_User_Role_Assignment_Failed,
                            Errors = errors
                        };
                    }
                }

                var roles = await _userManager.GetRolesAsync(user);
                return new GenericResponse<UserDto>
                {
                    StatusCode = ResponseStatusCode.Success,
                    Data = MapToUserDto(user, roles),
                    Message = Messages.Success_User_Updated
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<UserDto>
                {
                    StatusCode = ResponseStatusCode.InternalServerError,
                    Message = Messages.ErrorGeneral
                };
            }
        }

        public async Task<GenericResponse<bool>> SoftDeleteUserAsync(int userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.NotFound,
                        Message = Messages.Error_User_Not_Found
                    };
                }

                user.IsActive = false;
                user.DeletedAt = DateTime.UtcNow;

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_User_Deletion_Failed,
                        Errors = errors
                    };
                }

                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.Success,
                    Data = true,
                    Message = Messages.Success_User_Deleted
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.InternalServerError,
                    Message = Messages.ErrorGeneral
                };
            }
        }

        public async Task<GenericResponse<UserDto>> GetUserByIdAsync(int userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    return new GenericResponse<UserDto>
                    {
                        StatusCode = ResponseStatusCode.NotFound,
                        Message = Messages.Error_User_Not_Found
                    };
                }

                var roles = await _userManager.GetRolesAsync(user);
                return new GenericResponse<UserDto>
                {
                    StatusCode = ResponseStatusCode.Success,
                    Data = MapToUserDto(user, roles),
                    Message = Messages.Success
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<UserDto>
                {
                    StatusCode = ResponseStatusCode.InternalServerError,
                    Message = Messages.ErrorGeneral
                };
            }
        }

        public async Task<PaginatedResponse<UserDto>> GetAllUsersAsync(GetAllUsersQuery query, CancellationToken cancellationToken)
        {
            try
            {
                var usersQuery =    from u in _context.Users
                                    join ur in _context.UserRoles on u.Id equals ur.UserId into userRoles
                                    from ur in userRoles.DefaultIfEmpty()
                                    join r in _context.Roles on ur.RoleId equals r.Id into roles
                                    from r in roles.DefaultIfEmpty()

                                    where string.IsNullOrWhiteSpace(query.SearchBy) ||
                                          u.FullName!.Contains(query.SearchBy) ||
                                          u.Email!.Contains(query.SearchBy) ||
                                          (r != null && r.Name!.Contains(query.SearchBy))
                                    group r by u into g
                                    select new UserDto
                                    {
                                        Id = g.Key.Id,
                                        UserName = g.Key.UserName!,
                                        Email = g.Key.Email!,
                                        FullName = g.Key.FullName,
                                        LastName = g.Key.FullName,
                                        PhoneNumber = g.Key.PhoneNumber,
                                        IsActive = g.Key.IsActive,
                                        CreatedAt = g.Key.CreatedAt,
                                        UpdatedAt = g.Key.UpdatedAt,
                                        Roles = g.Where(x => x != null).Select(x => x.Name).Distinct().ToList()!
                                    };

                // 📊 Total count
                var totalRecords = await usersQuery.CountAsync();

                var users = await usersQuery
                    .ApplySorting(query.SortBy, query.SortDirection)
                    .ApplyPagination(query.PageNumber, query.PageSize)
                    .ToListAsync(cancellationToken);

                return new PaginatedResponse<UserDto>
                {
                    Data = users,
                    PageNumber = query.PageNumber,
                    PageSize = query.PageSize,
                    TotalRecords = totalRecords,
                    StatusCode = totalRecords == 0 ? ResponseStatusCode.NoContent : ResponseStatusCode.Success,
                    Message = Messages.Success,
                };               
            }
            catch (Exception ex)
            {
                return new PaginatedResponse<UserDto>
                {
                    StatusCode = ResponseStatusCode.InternalServerError,
                    Message = ex.Message
                };
            }
        }

        public async Task<GenericResponse<bool>> RestoreUserAsync(int userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.NotFound,
                        Message = Messages.Error_User_Not_Found
                    };
                }

                user.IsActive = true;
                user.DeletedAt = null;

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_User_Restore_Failed,
                        Errors = errors
                    };
                }

                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.Success,
                    Data = true,
                    Message = Messages.Success_User_Restored
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.InternalServerError,
                    Message = Messages.ErrorGeneral
                };
            }
        }

        private UserDto MapToUserDto(ApplicationUser user, IList<string> roles)
        {
            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName!,
                Email = user.Email!,
                IsActive = user.IsActive,
                Roles = roles,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }

        public async Task<GenericResponse<List<string>>> GetAllRolesAsync()
        {
            // If you're using Identity RoleManager
            var roles = await _roleManager.Roles
                .Where(r => r.Name != null)
                .Select(r => r.Name!)
                .ToListAsync();

            return new GenericResponse<List<string>>
            {
                StatusCode = roles.Any() ? ResponseStatusCode.Success : ResponseStatusCode.NoContent,
                Data = roles,
                Message = Messages.Success
            };            
        }
        public async Task<GenericResponse<List<string>>> GetUserRolesAsync()
        {
            try
            {
                var userId = _userService.GetCurrentUserId();
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null)
                {
                    return new GenericResponse<List<string>>
                    {
                        StatusCode = ResponseStatusCode.NotFound,
                        Message = Messages.Error_User_Not_Found
                    };
                }

                var roles = await _userManager.GetRolesAsync(user);
                return new GenericResponse<List<string>>
                {
                    StatusCode = ResponseStatusCode.Success,
                    Data = roles.ToList(),
                    Message = Messages.Success
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<List<string>>
                {
                    StatusCode = ResponseStatusCode.InternalServerError,
                    Message = ex.Message,
                };
            }
        }

        public async Task<GenericResponse<bool>> AssignRolesToUserAsync(int userId, List<string> roles)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null || !user.IsActive)
                {
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.NotFound,
                        Message = Messages.Error_User_Not_Found
                    };
                }

                // Get current roles to avoid duplicates
                var currentRoles = await _userManager.GetRolesAsync(user);
                var rolesToAdd = roles.Except(currentRoles).ToList();

                if (!rolesToAdd.Any())
                {
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.Success,
                        Data = true,
                        Message = "User already has all specified roles"
                    };
                }

                var result = await _userManager.AddToRolesAsync(user, rolesToAdd);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_User_Role_Assignment_Failed,
                        Errors = errors
                    };
                }

                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.Success,
                    Data = true,
                    Message = $"Successfully assigned {rolesToAdd.Count} roles to user"
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.InternalServerError,
                    Message = Messages.ErrorGeneral
                };
            }
        }

        public async Task<GenericResponse<bool>> RemoveRolesFromUserAsync(int userId, List<string> roles)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null || !user.IsActive)
                {
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.NotFound,
                        Message = Messages.Error_User_Not_Found
                    };
                }

                // Get current roles to ensure we only remove existing ones
                var currentRoles = await _userManager.GetRolesAsync(user);
                var rolesToRemove = roles.Intersect(currentRoles).ToList();

                if (!rolesToRemove.Any())
                {
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.Success,
                        Data = true,
                        Message = "User doesn't have any of the specified roles"
                    };
                }

                var result = await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_User_Role_Removal_Failed,
                        Errors = errors
                    };
                }

                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.Success,
                    Data = true,
                    Message = $"Successfully removed {rolesToRemove.Count} roles from user"
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.InternalServerError,
                    Message = Messages.ErrorGeneral
                };
            }
        }

        public async Task<GenericResponse<bool>> ResetUserPasswordAsync(int userId, string newPassword)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user == null || !user.IsActive)
                {
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.NotFound,
                        Message = Messages.Error_User_Not_Found
                    };
                }

                // Generate password reset token and reset password
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, newPassword);

                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_Password_Reset_Failed,
                        Errors = errors
                    };
                }

                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.Success,
                    Data = true,
                    Message = Messages.Success_Password_Reset
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.InternalServerError,
                    Message = Messages.ErrorGeneral
                };
            }
        }
        public async Task<GenericResponse<bool>> CreateRoleAsync(string roleName, string? description = null)
        {
            try
            {
                // Check if role already exists
                var roleExists = await _roleManager.RoleExistsAsync(roleName);
                if (roleExists)
                {
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_Role_Already_Exists
                    };
                }

                var role = new ApplicationRole
                {
                    Name = roleName,
                    Description = description,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await _roleManager.CreateAsync(role);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_Role_Creation_Failed,
                        Errors = errors
                    };
                }

                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.Success,
                    Data = true,
                    Message = Messages.Success_Role_Created
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.InternalServerError,
                    Message = Messages.ErrorGeneral
                };
            }
        }
        public async Task<GenericResponse<bool>> UpdateRoleAsync(string currentRoleName, string newRoleName, string? description = null)
        {
            try
            {
                var role = await _roleManager.FindByNameAsync(currentRoleName);
                if (role == null)
                {
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.NotFound,
                        Message = Messages.Error_Role_Not_Found
                    };
                }

                // Check if new role name already exists (if changing name)
                if (currentRoleName != newRoleName)
                {
                    var newRoleExists = await _roleManager.RoleExistsAsync(newRoleName);
                    if (newRoleExists)
                    {
                        return new GenericResponse<bool>
                        {
                            StatusCode = ResponseStatusCode.BadRequest,
                            Message = Messages.Error_Role_Already_Exists
                        };
                    }
                }

                role.Name = newRoleName;
                role.Description = description;

                var result = await _roleManager.UpdateAsync(role);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_Role_Update_Failed,
                        Errors = errors
                    };
                }

                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.Success,
                    Data = true,
                    Message = Messages.Success_Role_Updated
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.InternalServerError,
                    Message = Messages.ErrorGeneral
                };
            }
        }


        public async Task<GenericResponse<bool>> DeleteRoleAsync(string roleName)
        {
            try
            {
                var role = await _roleManager.FindByNameAsync(roleName);
                if (role == null)
                {
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.NotFound,
                        Message = Messages.Error_Role_Not_Found
                    };
                }

                // Check if any users have this role
                var usersInRole = await _userManager.GetUsersInRoleAsync(roleName);
                if (usersInRole.Any())
                {
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_Role_Has_Users,
                        Errors = new List<string> { $"Cannot delete role '{roleName}' because {usersInRole.Count} users are assigned to it" }
                    };
                }

                var result = await _roleManager.DeleteAsync(role);
                if (!result.Succeeded)
                {
                    var errors = result.Errors.Select(e => e.Description).ToList();
                    return new GenericResponse<bool>
                    {
                        StatusCode = ResponseStatusCode.BadRequest,
                        Message = Messages.Error_Role_Deletion_Failed,
                        Errors = errors
                    };
                }

                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.Success,
                    Data = true,
                    Message = Messages.Success_Role_Deleted
                };
            }
            catch (Exception ex)
            {
                return new GenericResponse<bool>
                {
                    StatusCode = ResponseStatusCode.InternalServerError,
                    Message = Messages.ErrorGeneral
                };
            }
        }
    }
}
