using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.Security.Commands.UpdateSalesPin
{
    public class UpdateSalesPinCommand : IRequest<GenericResponse<string>>
    {
        public string Pin { get; set; } = default!;
    }
}
