using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Security.Commands.UpdateSalesPin
{
    public class UpdateSalesPinHandler : IRequestHandler<UpdateSalesPinCommand, GenericResponse<string>>
    {
        private readonly IApplicationDbContext _context;

        public UpdateSalesPinHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<string>> Handle(UpdateSalesPinCommand request, CancellationToken cancellationToken)
        {
            var pin = request.Pin?.Trim() ?? string.Empty;

            if (pin.Length != 4 || !pin.All(char.IsDigit))
                return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_Security_Pin_Invalid);

            var setting = await _context.SecurityPinSettings.FirstOrDefaultAsync(cancellationToken);

            if (setting == null)
            {
                setting = new SecurityPinSetting { Id = Guid.NewGuid(), Pin = pin };
                _context.SecurityPinSettings.Add(setting);
            }
            else
            {
                setting.Pin = pin;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return GenericResponse<string>.Success(setting.Pin, Messages.Success_Security_Pin_Updated);
        }
    }
}
