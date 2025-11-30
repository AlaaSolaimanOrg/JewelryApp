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
                return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, "Log IDs list cannot be empty.");
            }

            // Server-side delete without loading entities
            var deletedCount = await _context.Logs
                .Where(log => request.LogIds.Contains(log.Id))
                .ExecuteDeleteAsync(cancellationToken);

            if (deletedCount == 0)
            {
                return GenericResponse<string>.NotFound(Messages.ErrorNotFound);
            }

            return GenericResponse<string>.Success(null, Messages.Success);
        }
    }
}
