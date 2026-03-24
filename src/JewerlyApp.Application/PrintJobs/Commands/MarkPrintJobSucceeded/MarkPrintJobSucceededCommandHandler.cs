using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using MediatR;

namespace JewerlyApp.Application.PrintJobs.Commands.MarkPrintJobSucceeded
{
    public class MarkPrintJobSucceededCommandHandler : IRequestHandler<MarkPrintJobSucceededCommand, GenericResponse<bool>>
    {
        private readonly IPrintJobRepository _printJobRepository;

        public MarkPrintJobSucceededCommandHandler(IPrintJobRepository printJobRepository)
        {
            _printJobRepository = printJobRepository;
        }

        public async Task<GenericResponse<bool>> Handle(MarkPrintJobSucceededCommand request, CancellationToken cancellationToken)
        {
            if (request.JobId == Guid.Empty)
            {
                return GenericResponse<bool>.ValidationError(new List<string> { "JobId is required." });
            }

            await _printJobRepository.MarkSucceededAsync(request.JobId, cancellationToken);

            return GenericResponse<bool>.Success(true, "Print job marked as printed.");
        }
    }
}