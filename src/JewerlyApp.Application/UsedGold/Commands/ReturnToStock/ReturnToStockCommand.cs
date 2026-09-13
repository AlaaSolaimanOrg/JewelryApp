using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.UsedGold.Commands.ReturnToStock
{
    public class ReturnToStockCommand : IRequest<GenericResponse<string>>
    {
        public int Karat { get; set; }
        public decimal Weight { get; set; }
        public string? Notes { get; set; }
    }
}
