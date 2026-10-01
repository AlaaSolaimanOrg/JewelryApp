using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.InventorySettings.Commands.UpdateLowStockThreshold
{
    public class UpdateLowStockThresholdCommand : IRequest<GenericResponse<int>>
    {
        public int Threshold { get; set; }
    }
}
