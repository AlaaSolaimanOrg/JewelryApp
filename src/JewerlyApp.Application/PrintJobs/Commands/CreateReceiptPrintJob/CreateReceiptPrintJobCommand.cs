using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.ValueObjects;
using MediatR;

namespace JewerlyApp.Application.PrintJobs.Commands.CreateReceiptPrintJob
{
    public class CreateReceiptPrintJobCommand : IRequest<GenericResponse<Guid>>
    {
        public string StoreId { get; set; } = string.Empty;
        public string PrinterId { get; set; } = string.Empty;
        public ReceiptPrintPayload ReceiptPayload { get; set; } = new();
    }
}