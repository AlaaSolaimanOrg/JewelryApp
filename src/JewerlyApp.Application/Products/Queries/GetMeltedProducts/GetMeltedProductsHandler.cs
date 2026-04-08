using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Products.Queries.GetMeltedProducts
{
    public class GetMeltedProductsHandler : IRequestHandler<GetMeltedProductsQuery, PaginatedResponse<MeltedProductVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetMeltedProductsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResponse<MeltedProductVM>> Handle(GetMeltedProductsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.MeltRecords.AsNoTracking().OrderByDescending(m => m.MeltedAt);

            var total = await query.CountAsync(cancellationToken);

            var items = await query.Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(m => new MeltedProductVM
                {
                    Id = m.Id,
                    ProductId = m.ProductId,
                    Sku = m.Sku,
                    ProductName = m.ProductName,
                    Quantity = m.Quantity,
                    Weight = m.Weight,
                    KaratType = m.KaratType,
                    MeltedAt = m.MeltedAt
                })
                .ToListAsync(cancellationToken);

            return new PaginatedResponse<MeltedProductVM>
            {
                StatusCode = ResponseStatusCode.Success,
                TotalRecords = total,
                Data = items,
                PageSize = request.PageSize,
                PageNumber = request.PageNumber
            };
        }
    }
}
