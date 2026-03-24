using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.PrintJobs.Dtos;
using MediatR;

namespace JewerlyApp.Application.PrintJobs.Commands.ClaimNextPrintJob
{
    public class ClaimNextPrintJobCommand : IRequest<GenericResponse<PrintJobDto?>>
    {
        public string StoreId { get; set; } = string.Empty;
        public string PrinterId { get; set; } = string.Empty;
    }
}