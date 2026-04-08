using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Products.Queries.GetMeltedReports
{
    public class GetMeltedReportsHandler : IRequestHandler<GetMeltedReportsQuery, GenericResponse<MeltedReportsVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetMeltedReportsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<MeltedReportsVM>> Handle(GetMeltedReportsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.MeltRecords.AsNoTracking();

            if (request.DateFrom.HasValue && request.DateTo.HasValue)
            {
                query = query.Where(m => m.MeltedAt >= request.DateFrom.Value && m.MeltedAt <= request.DateTo.Value);
            }

            var grouped = await query
                .GroupBy(m => m.KaratType)
                .Select(g => new KaratInventoryReportVM
                {
                    KaratType = g.Key ?? -1,
                    ItemCount = g.Sum(x => x.Quantity),
                    TotalWeight = g.Sum(x => x.Weight ?? 0)
                })
                .ToListAsync(cancellationToken);

            return new GenericResponse<MeltedReportsVM>
            {
                StatusCode = ResponseStatusCode.Success,
                Data = new MeltedReportsVM { Melted = grouped.ToArray() }
            };
        }
    }
}
