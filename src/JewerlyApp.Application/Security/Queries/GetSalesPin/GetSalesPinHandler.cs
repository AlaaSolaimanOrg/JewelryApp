using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Security.Queries.GetSalesPin
{
    public class GetSalesPinHandler : IRequestHandler<GetSalesPinQuery, GenericResponse<string>>
    {
        private readonly IApplicationDbContext _context;

        public GetSalesPinHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<string>> Handle(GetSalesPinQuery request, CancellationToken cancellationToken)
        {
            var pin = await SalesPinResolver.GetCurrentPinAsync(_context, cancellationToken);

            return GenericResponse<string>.Success(pin);
        }
    }
}
