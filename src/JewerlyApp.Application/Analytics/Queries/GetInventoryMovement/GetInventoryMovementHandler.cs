using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Analytics.Queries.GetInventoryMovement
{
    public class GetInventoryMovementHandler : IRequestHandler<GetInventoryMovementQuery, GenericResponse<InventoryMovementVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetInventoryMovementHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<InventoryMovementVM>> Handle(GetInventoryMovementQuery request, CancellationToken cancellationToken)
        {
            var range = request.ResolveDateRange();

            var addedQuery = _context.Products.AsQueryable();
            var soldQuery = _context.SaleItems.AsQueryable();
            var returnedQuery = _context.ReturnItems.AsQueryable();
            var meltedQuery = _context.MeltRecords.AsQueryable();

            if (range.StartUtc.HasValue)
            {
                addedQuery = addedQuery.Where(p => p.CreatedDate >= range.StartUtc.Value);
                soldQuery = soldQuery.Where(si => si.CreatedDate >= range.StartUtc.Value);
                returnedQuery = returnedQuery.Where(ri => ri.CreatedDate >= range.StartUtc.Value);
                meltedQuery = meltedQuery.Where(m => m.MeltedAt >= range.StartUtc.Value);
            }

            if (range.EndUtc.HasValue)
            {
                addedQuery = addedQuery.Where(p => p.CreatedDate <= range.EndUtc.Value);
                soldQuery = soldQuery.Where(si => si.CreatedDate <= range.EndUtc.Value);
                returnedQuery = returnedQuery.Where(ri => ri.CreatedDate <= range.EndUtc.Value);
                meltedQuery = meltedQuery.Where(m => m.MeltedAt <= range.EndUtc.Value);
            }

            var addedProducts = await addedQuery
                .Select(p => new { p.Weight, p.Quantity })
                .ToListAsync(cancellationToken);

            var soldItems = await soldQuery
                .Select(si => new { si.Weight, si.Quantity })
                .ToListAsync(cancellationToken);

            var returnedItems = await returnedQuery
                .Select(ri => new { ri.QuantityReturned, Weight = ri.SaleItem.Weight })
                .ToListAsync(cancellationToken);

            var meltedGrams = await meltedQuery.SumAsync(m => (m.Weight ?? 0) * m.Quantity, cancellationToken);

            var vm = new InventoryMovementVM
            {
                AddedItems = addedProducts.Sum(p => p.Quantity ?? 1),
                AddedGrams = addedProducts.Sum(p => p.Weight * (p.Quantity ?? 1)),
                SoldItems = soldItems.Sum(si => si.Quantity),
                SoldGrams = soldItems.Sum(si => si.Weight * si.Quantity),
                ReturnedItems = returnedItems.Sum(ri => ri.QuantityReturned),
                ReturnedGrams = returnedItems.Sum(ri => ri.Weight * ri.QuantityReturned),
                MeltedGrams = meltedGrams,
            };

            return new GenericResponse<InventoryMovementVM>
            {
                Data = vm,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
