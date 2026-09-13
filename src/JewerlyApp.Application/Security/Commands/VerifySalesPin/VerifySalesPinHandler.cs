using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Security.Commands.VerifySalesPin
{
    public class VerifySalesPinHandler : IRequestHandler<VerifySalesPinCommand, GenericResponse<bool>>
    {
        private readonly IApplicationDbContext _context;

        public VerifySalesPinHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<bool>> Handle(VerifySalesPinCommand request, CancellationToken cancellationToken)
        {
            var currentPin = await SalesPinResolver.GetCurrentPinAsync(_context, cancellationToken);

            if (request.Pin?.Trim() != currentPin)
                return GenericResponse<bool>.Error(ResponseStatusCode.BadRequest, Messages.Error_Security_Pin_Incorrect);

            return GenericResponse<bool>.Success(true, Messages.Success_Security_Pin_Verified);
        }
    }
}
