using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;

namespace JewerlyApp.Application.PrintJobs.Commands.CreateReceiptPrintJob
{
    public class CreateReceiptPrintJobCommandHandler : IRequestHandler<CreateReceiptPrintJobCommand, GenericResponse<Guid>>
    {
        private readonly IPrintJobRepository _printJobRepository;

        public CreateReceiptPrintJobCommandHandler(IPrintJobRepository printJobRepository)
        {
            _printJobRepository = printJobRepository;
        }

        public async Task<GenericResponse<Guid>> Handle(CreateReceiptPrintJobCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.StoreId))
            {
                return GenericResponse<Guid>.ValidationError(new List<string> { "StoreId is required." });
            }

            if (string.IsNullOrWhiteSpace(request.PrinterId))
            {
                return GenericResponse<Guid>.ValidationError(new List<string> { "PrinterId is required." });
            }

            if (request.ReceiptPayload is null || string.IsNullOrWhiteSpace(request.ReceiptPayload.Html))
            {
                return GenericResponse<Guid>.ValidationError(new List<string> { "Receipt payload HTML is required." });
            }

            var printJob = new PrintJob
            {
                Id = Guid.NewGuid(),
                StoreId = request.StoreId.Trim(),
                PrinterId = request.PrinterId.Trim(),
                Status = PrintJobStatus.Pending,
                Payload = request.ReceiptPayload,
                CreatedAt = DateTime.UtcNow
            };

            await _printJobRepository.AddAsync(printJob, cancellationToken);

            return GenericResponse<Guid>.Created(printJob.Id, "Print job created successfully.");
        }
    }
}