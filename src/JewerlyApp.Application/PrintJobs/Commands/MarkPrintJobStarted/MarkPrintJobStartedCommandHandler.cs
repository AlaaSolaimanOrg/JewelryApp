using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using MediatR;

namespace JewerlyApp.Application.PrintJobs.Commands.MarkPrintJobStarted
{
    public class MarkPrintJobStartedCommandHandler : IRequestHandler<MarkPrintJobStartedCommand, GenericResponse<bool>>
    {
        private readonly IPrintJobRepository _printJobRepository;

        public MarkPrintJobStartedCommandHandler(IPrintJobRepository printJobRepository)
        {
            _printJobRepository = printJobRepository;
        }

        public async Task<GenericResponse<bool>> Handle(MarkPrintJobStartedCommand request, CancellationToken cancellationToken)
        {
            if (request.JobId == Guid.Empty)
            {
                return GenericResponse<bool>.ValidationError(new List<string> { "JobId is required." });
            }

            await _printJobRepository.MarkStartedAsync(request.JobId, cancellationToken);

            return GenericResponse<bool>.Success(true, "Print job marked as started.");
        }
    }
}