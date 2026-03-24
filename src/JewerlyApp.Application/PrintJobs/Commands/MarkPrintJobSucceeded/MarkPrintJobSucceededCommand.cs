using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.PrintJobs.Commands.MarkPrintJobSucceeded
{
    public class MarkPrintJobSucceededCommand : IRequest<GenericResponse<bool>>
    {
        public Guid JobId { get; set; }
    }
}