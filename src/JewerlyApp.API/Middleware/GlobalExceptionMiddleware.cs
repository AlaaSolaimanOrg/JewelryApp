using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Interfaces;
using System.Net;
using System.Security.Claims;
using System.Text.Json;

namespace JewerlyApp.API.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public GlobalExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IApplicationDbContext dbContext)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, dbContext, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, IApplicationDbContext dbContext, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var userId = 0;
            if (context.User?.Identity?.IsAuthenticated == true)
            {
                var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(userIdClaim, out int parsedId))
                {
                    userId = parsedId;
                }
            }

            var correlationId = context.Items["CorrelationId"]?.ToString();

            // Determine handler name from exception stack trace
            string handlerName = GetHandlerNameFromException(exception);

            // Log the error to the database
            try
            {
                await Logger.LogErrorAsync(
                    dbContext,
                    handlerName,
                    exception.Message,
                    exception,
                    null,
                    userId,
                    correlationId,
                    CancellationToken.None);
            }
            catch
            {
                // If logging fails, we don't want to throw another exception
                // Ideally log to a file or console here as fallback
                Console.WriteLine($"Failed to log exception to DB: {exception}");
            }

            var response = new
            {
                StatusCode = context.Response.StatusCode,
                Message = "An internal server error occurred.",
                Detailed = exception.Message, // You might want to hide this in production
                CorrelationId = correlationId
            };

            var json = JsonSerializer.Serialize(response);

            await context.Response.WriteAsync(json);
        }

        private string GetHandlerNameFromException(Exception exception)
        {
            // Try to get the declaring type from TargetSite
            var declaringType = exception.TargetSite?.DeclaringType;
            
            // If it's a compiler-generated async type (contains '<' and '>'), extract the real class
            if (declaringType != null && declaringType.Name.Contains('<'))
            {
                // Get the declaring type of the compiler-generated type (the actual handler class)
                declaringType = declaringType.DeclaringType;
            }

            if (declaringType != null)
                return declaringType.Name;

            // Fallback: parse stack trace to find first non-async-state-machine type
            var stackTrace = new System.Diagnostics.StackTrace(exception, true);
            foreach (var frame in stackTrace.GetFrames() ?? Array.Empty<System.Diagnostics.StackFrame>())
            {
                var method = frame.GetMethod();
                if (method?.DeclaringType != null)
                {
                    var typeName = method.DeclaringType.Name;
                    // Skip compiler-generated types and middleware types
                    if (!typeName.Contains('<') && !typeName.Contains("Middleware"))
                    {
                        return typeName;
                    }
                }
            }

            return "GlobalExceptionMiddleware";
        }
    }
}
