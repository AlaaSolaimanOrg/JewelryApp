using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Infrastructure.Identity
{
    public static class IdentitySeeder
    {
        public static async Task SeedUsersAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            string adminRoleName = "Admin";
            string role2 = "Admin2";

            string adminEmail = "admin@gmail.com";
            string adminPassword = "Admin@123"; // ⚠ Change in production

            string posRole = "PosRole";
            string posEmail = "pos@gmail.com";
            string posPassword = "Pos@123";

            // create admin
            await CreateUserWithRolesAsync(userManager, roleManager,
                adminEmail, adminPassword, "System Administrator", new[] { adminRoleName, role2 });

            await CreateUserWithRolesAsync(userManager, roleManager,
                posEmail, posPassword, "Pos user", new[] { posRole });
        }

        /// <summary>
        /// Creates a user if not exists, ensures roles, and assigns them to the user.
        /// </summary>
        public static async Task<ApplicationUser> CreateUserWithRolesAsync(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            string email,
            string password,
            string fullName,
            string[] roles)
        {
            // 1️⃣ Ensure roles exist
            foreach (var roleName in roles)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new ApplicationRole
                    {
                        Name = roleName,
                        Description = $"{roleName} Role"
                    });
                }
            }

            // 2️⃣ Ensure user exists
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    FullName = fullName,
                    EmailConfirmed = true,
                    IsActive = true,
                };

                var result = await userManager.CreateAsync(user, password);
                if (!result.Succeeded)
                {
                    throw new Exception($"Failed to create user {email}: {string.Join(", ", result.Errors)}");
                }
            }
            else
            {
                user.IsActive = true;
                await userManager.UpdateAsync(user);
            }
            

            // 3️⃣ Ensure user is in the roles
            foreach (var roleName in roles)
            {
                if (!await userManager.IsInRoleAsync(user, roleName))
                {
                    await userManager.AddToRoleAsync(user, roleName);
                }
            }

            return user;
        }
    }
}
