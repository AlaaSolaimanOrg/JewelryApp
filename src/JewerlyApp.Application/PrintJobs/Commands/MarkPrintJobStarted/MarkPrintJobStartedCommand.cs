using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.PrintJobs.Commands.MarkPrintJobStarted
{
    public class MarkPrintJobStartedCommand : IRequest<GenericResponse<bool>>
    {
        public Guid JobId { get; set; }
    }
}