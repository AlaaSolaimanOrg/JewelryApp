using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.InventorySettings.Commands.UpdateLowStockThreshold
{
    public class UpdateLowStockThresholdHandler : IRequestHandler<UpdateLowStockThresholdCommand, GenericResponse<int>>
    {
        private const int MaxThreshold = 100000;

        private readonly IApplicationDbContext _context;

        public UpdateLowStockThresholdHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<int>> Handle(UpdateLowStockThresholdCommand request, CancellationToken cancellationToken)
        {
            if (request.Threshold < 0 || request.Threshold > MaxThreshold)
                return GenericResponse<int>.Error(ResponseStatusCode.BadRequest, Messages.Error_Inventory_LowStockThreshold_Invalid);

            var setting = await _context.InventorySettings.FirstOrDefaultAsync(cancellationToken);

            if (setting == null)
            {
                setting = new InventorySetting { Id = Guid.NewGuid(), LowStockThreshold = request.Threshold };
                _context.InventorySettings.Add(setting);
            }
            else
            {
                setting.LowStockThreshold = request.Threshold;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return GenericResponse<int>.Success(setting.LowStockThreshold, Messages.Success_Inventory_LowStockThreshold_Updated);
        }
    }
}
