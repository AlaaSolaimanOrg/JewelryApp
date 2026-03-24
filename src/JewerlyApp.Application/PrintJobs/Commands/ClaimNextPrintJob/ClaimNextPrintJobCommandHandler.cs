using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.PrintJobs.Dtos;
using JewerlyApp.Application.PrintJobs.Mapping;
using MediatR;

namespace JewerlyApp.Application.PrintJobs.Commands.ClaimNextPrintJob
{
    public class ClaimNextPrintJobCommandHandler : IRequestHandler<ClaimNextPrintJobCommand, GenericResponse<PrintJobDto?>>
    {
        private readonly IPrintJobRepository _printJobRepository;

        public ClaimNextPrintJobCommandHandler(IPrintJobRepository printJobRepository)
        {
            _printJobRepository = printJobRepository;
        }

        public async Task<GenericResponse<PrintJobDto?>> Handle(ClaimNextPrintJobCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.StoreId) || string.IsNullOrWhiteSpace(request.PrinterId))
            {
                return GenericResponse<PrintJobDto?>.ValidationError(new List<string>
                {
                    "StoreId and PrinterId are required."
                });
            }

            var claimedJob = await _printJobRepository.ClaimNextPendingAsync(
                request.StoreId.Trim(),
                request.PrinterId.Trim(),
                cancellationToken);

            return GenericResponse<PrintJobDto?>.Success(claimedJob?.ToDto(), "Claim attempt completed.");
        }
    }
}