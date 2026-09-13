using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.UsedGold.Commands.SendToMelt
{
    public class SendToMeltCommand : IRequest<GenericResponse<string>>
    {
        public decimal TotalWeight { get; set; }
        public string? Notes { get; set; }
    }
}
