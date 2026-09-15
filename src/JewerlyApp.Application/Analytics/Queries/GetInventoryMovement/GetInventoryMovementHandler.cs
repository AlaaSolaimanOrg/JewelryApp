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
            var addedQuery = _context.Products.AsQueryable();
            var soldQuery = _context.SaleItems.AsQueryable();
            var returnedQuery = _context.ReturnItems.AsQueryable();
            var meltedQuery = _context.MeltRecords.AsQueryable();

            if (request.DateFrom.HasValue)
            {
                addedQuery = addedQuery.Where(p => p.CreatedDate >= request.DateFrom.Value);
                soldQuery = soldQuery.Where(si => si.CreatedDate >= request.DateFrom.Value);
                returnedQuery = returnedQuery.Where(ri => ri.CreatedDate >= request.DateFrom.Value);
                meltedQuery = meltedQuery.Where(m => m.MeltedAt >= request.DateFrom.Value);
            }

            if (request.DateTo.HasValue)
            {
                addedQuery = addedQuery.Where(p => p.CreatedDate <= request.DateTo.Value);
                soldQuery = soldQuery.Where(si => si.CreatedDate <= request.DateTo.Value);
                returnedQuery = returnedQuery.Where(ri => ri.CreatedDate <= request.DateTo.Value);
                meltedQuery = meltedQuery.Where(m => m.MeltedAt <= request.DateTo.Value);
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

            var meltedGrams = await meltedQuery.SumAsync(m => m.Weight ?? 0, cancellationToken);

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
