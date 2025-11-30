using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.Logs.Commands.DeleteLogs
{
    public class DeleteLogsCommand : IRequest<GenericResponse<string>>
    {
        public List<Guid> LogIds { get; set; } = new();
    }
}
