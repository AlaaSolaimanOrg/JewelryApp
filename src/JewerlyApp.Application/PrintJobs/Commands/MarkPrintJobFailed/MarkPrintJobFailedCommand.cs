using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.PrintJobs.Commands.MarkPrintJobFailed
{
    public class MarkPrintJobFailedCommand : IRequest<GenericResponse<bool>>
    {
        public Guid JobId { get; set; }
        public string FailureReason { get; set; } = string.Empty;
    }
}