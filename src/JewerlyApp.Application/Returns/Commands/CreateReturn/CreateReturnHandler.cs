using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using MediatR;

namespace JewerlyApp.Application.Returns.Commands.CreateReturn
{
    public class CreateReturnHandler : IRequestHandler<CreateReturnCommand, GenericResponse<string>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserService _userService;

        public CreateReturnHandler(IApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<GenericResponse<string>> Handle(CreateReturnCommand request, CancellationToken cancellationToken)
        {
            var loggedInUser = await _userService.GetLoggedInUser();

            var (error, sale) = await ReturnProcessor.ValidateAsync(_context, request.SaleId, request.Items, cancellationToken);
            if (error != null)
                return error;

            var ret = await ReturnProcessor.CreateAsync(
                _context,
                sale!,
                request.Items,
                request.RefundMethod,
                loggedInUser.Id,
                null,
                cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return GenericResponse<string>.Success(ret.Id.ToString());
        }
    }
}
