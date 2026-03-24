using JewerlyApp.Application.Interfaces;
using JewerlyApp.Infrastructure.Context;
using JewerlyApp.Infrastructure.Services;
using JewerlyApp.Infrastructure.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace JewerlyApp.Infrastructure
{
    public static class InfrastructureServiceRegistration
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(config.GetConnectionString("DbConnection")));

            services.Configure<FileStorageSettings>(config.GetSection("FileStorage"));
            services.Configure<TwilioSettings>(config.GetSection("Twilio"));

            services.AddScoped<IApplicationDbContext>(provider =>
                provider.GetRequiredService<ApplicationDbContext>());

            services.AddScoped<ISkuService, SkuService>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<ITokenService, JwtTokenService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IUserManagementService, UserManagementService>();
            services.AddScoped<ISmsService, TwilioSmsService>();
            services.AddScoped<IPrintJobRepository, EfPrintJobRepository>();
            services.AddScoped<IPrinterRepository, EfPrinterRepository>();

            return services;
        }
    }
}
