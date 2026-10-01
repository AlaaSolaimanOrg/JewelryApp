using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Security;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetTodaySalesSummary
{
    public class GetTodaySalesSummaryHandler : IRequestHandler<GetTodaySalesSummaryQuery, GenericResponse<TodaySalesSummaryDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetTodaySalesSummaryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<TodaySalesSummaryDto>> Handle(GetTodaySalesSummaryQuery request, CancellationToken cancellationToken)
        {
            var currentPin = await SalesPinResolver.GetCurrentPinAsync(_context, cancellationToken);

            if (request.Pin?.Trim() != currentPin)
                return GenericResponse<TodaySalesSummaryDto>.Error(ResponseStatusCode.BadRequest, Messages.Error_Security_Pin_Incorrect);

            var (todayStartUtc, todayEndUtc) = BusinessTimeZoneHelper.GetUtcBoundsForEdmontonDate(BusinessTimeZoneHelper.GetEdmontonDate());

            var todaysSales = await _context.Sales
                .AsNoTracking()
                .Where(s => s.CreatedDate >= todayStartUtc && s.CreatedDate <= todayEndUtc)
                .Select(s => s.Total)
                .ToListAsync(cancellationToken);

            var dto = new TodaySalesSummaryDto
            {
                TodaySalesTotal = todaysSales.Sum(),
                TodaySalesCount = todaysSales.Count,
            };

            return GenericResponse<TodaySalesSummaryDto>.Success(dto);
        }
    }
}
