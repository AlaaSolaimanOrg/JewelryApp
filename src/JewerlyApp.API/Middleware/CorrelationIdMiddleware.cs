using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;

namespace JewerlyApp.API.Middleware
{
    public class CorrelationIdMiddleware
    {
        private readonly RequestDelegate _next;
        private const string CorrelationIdHeader = "X-Correlation-ID";

        public CorrelationIdMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var correlationId = GetCorrelationId(context);

            // Store in HttpContext items for internal use
            context.Items["CorrelationId"] = correlationId;

            // Add to response headers
            context.Response.OnStarting(() =>
            {
                context.Response.Headers[CorrelationIdHeader] = correlationId;
                return Task.CompletedTask;
            });

            await _next(context);
        }

        private string GetCorrelationId(HttpContext context)
        {
            if (context.Request.Headers.TryGetValue(CorrelationIdHeader, out var correlationId))
            {
                return correlationId.ToString();
            }

            return Guid.NewGuid().ToString();
        }
    }
}
