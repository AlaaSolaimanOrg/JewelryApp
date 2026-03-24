using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using MediatR;

namespace JewerlyApp.Application.PrintJobs.Commands.MarkPrintJobFailed
{
    public class MarkPrintJobFailedCommandHandler : IRequestHandler<MarkPrintJobFailedCommand, GenericResponse<bool>>
    {
        private readonly IPrintJobRepository _printJobRepository;

        public MarkPrintJobFailedCommandHandler(IPrintJobRepository printJobRepository)
        {
            _printJobRepository = printJobRepository;
        }

        public async Task<GenericResponse<bool>> Handle(MarkPrintJobFailedCommand request, CancellationToken cancellationToken)
        {
            if (request.JobId == Guid.Empty)
            {
                return GenericResponse<bool>.ValidationError(new List<string> { "JobId is required." });
            }

            if (string.IsNullOrWhiteSpace(request.FailureReason))
            {
                return GenericResponse<bool>.ValidationError(new List<string> { "FailureReason is required." });
            }

            await _printJobRepository.MarkFailedAsync(request.JobId, request.FailureReason.Trim(), cancellationToken);

            return GenericResponse<bool>.Success(true, "Print job marked as failed.");
        }
    }
}