using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.Security.Commands.VerifySalesPin
{
    public class VerifySalesPinCommand : IRequest<GenericResponse<bool>>
    {
        public string Pin { get; set; } = default!;
    }
}
