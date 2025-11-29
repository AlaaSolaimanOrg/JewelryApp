using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Logs.Commands.DeleteLogs
{
    internal class DeleteLogsHandler : IRequestHandler<DeleteLogsCommand, GenericResponse<string>>
    {
        private readonly IApplicationDbContext _context;

        public DeleteLogsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<string>> Handle(DeleteLogsCommand request, CancellationToken cancellationToken)
        {
            // Validation
            if (request.LogIds == null || !request.LogIds.Any())
            {
                return new GenericResponse<string>
                {
                    Data = null,
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = "Log IDs list cannot be empty."
                };
            }

            // Find logs to delete
            var logsToDelete = await _context.Logs
                .Where(log => request.LogIds.Contains(log.Id))
                .ToListAsync(cancellationToken);

            if (!logsToDelete.Any())
            {
                return new GenericResponse<string>
                {
                    Data = null,
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = "No logs found with the provided IDs."
                };
            }

            // Delete logs
            _context.Logs.RemoveRange(logsToDelete);
            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<string>
            {
                Data = $"{logsToDelete.Count} log(s) deleted successfully.",
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
