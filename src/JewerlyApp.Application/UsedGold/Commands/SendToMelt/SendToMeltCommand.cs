using JewerlyApp.Application.Common.Responses;
using MediatR;
using System.Collections.Generic;

namespace JewerlyApp.Application.UsedGold.Commands.SendToMelt
{
    public class SendToMeltCommand : IRequest<GenericResponse<string>>
    {
        public List<SendToMeltItemDto> Items { get; set; } = new();
        public string? Notes { get; set; }
    }
}
