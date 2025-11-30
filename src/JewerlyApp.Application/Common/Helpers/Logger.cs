using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Common.Helpers
{
    public static class Logger
    {
        public static async Task<Log> LogErrorAsync(
            IApplicationDbContext context,
            string handlerName,
            string message,
            Exception exception,
            object? content,
            int userId,
            string? correlationId = null,
            CancellationToken cancellationToken = default)
        {
            var log = new Log
            {
                Id = Guid.NewGuid(),
                HandlerName = handlerName,
                Level = LogLevel.Error,
                Message = message,
                Exception = exception.ToString(),
                Content = content != null ? JsonSerializer.Serialize(content, new JsonSerializerOptions
                {
                    WriteIndented = false,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                }) : null,
                LoggedInUserId = userId,
                CorrelationId = correlationId,
                CreatedAt = DateTime.UtcNow
            };

            context.Logs.Add(log);
            await context.SaveChangesAsync(cancellationToken);
            return log;
        }

        public static async Task<Log> LogInfoAsync(
            IApplicationDbContext context,
            string handlerName,
            string message,
            object? content,
            int userId,
            string? correlationId = null,
            CancellationToken cancellationToken = default)
        {
            var log = new Log
            {
                Id = Guid.NewGuid(),
                HandlerName = handlerName,
                Level = LogLevel.Info,
                Message = message,
                Content = content != null ? JsonSerializer.Serialize(content, new JsonSerializerOptions
                {
                    WriteIndented = false,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                }) : null,
                LoggedInUserId = userId,
                CorrelationId = correlationId,
                CreatedAt = DateTime.UtcNow
            };

            context.Logs.Add(log);
            await context.SaveChangesAsync(cancellationToken);
            return log;
        }

        // Quick error log without content
        public static async Task<Log> LogErrorAsync(
            IApplicationDbContext context,
            string handlerName,
            Exception exception,
            int userId,
            string? correlationId = null,
            CancellationToken cancellationToken = default)
        {
            return await LogErrorAsync(context, handlerName, exception.Message, exception, null, userId, correlationId, cancellationToken);
        }
    }
}
