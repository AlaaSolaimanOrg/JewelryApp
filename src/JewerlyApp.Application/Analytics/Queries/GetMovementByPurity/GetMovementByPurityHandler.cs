using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Analytics.Queries.GetMovementByPurity
{
    public class GetMovementByPurityHandler : IRequestHandler<GetMovementByPurityQuery, GenericResponse<PurityMovementVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetMovementByPurityHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<PurityMovementVM>> Handle(GetMovementByPurityQuery request, CancellationToken cancellationToken)
        {
            var addedQuery = _context.Products.AsQueryable();
            var returnedQuery = _context.ReturnItems.AsQueryable();

            if (request.DateFrom.HasValue)
            {
                addedQuery = addedQuery.Where(p => p.CreatedDate >= request.DateFrom.Value);
                returnedQuery = returnedQuery.Where(ri => ri.CreatedDate >= request.DateFrom.Value);
            }

            if (request.DateTo.HasValue)
            {
                addedQuery = addedQuery.Where(p => p.CreatedDate <= request.DateTo.Value);
                returnedQuery = returnedQuery.Where(ri => ri.CreatedDate <= request.DateTo.Value);
            }

            var addedProducts = await addedQuery
                .Select(p => new { p.KaratType, p.Weight, p.Quantity })
                .ToListAsync(cancellationToken);

            var returnedItems = await returnedQuery
                .Select(ri => new { ri.QuantityReturned, ri.SaleItem.KaratType, ri.SaleItem.Weight })
                .ToListAsync(cancellationToken);

            var added = addedProducts
                .GroupBy(p => p.KaratType)
                .Select(g => new PurityMovementRowVM
                {
                    KaratType = (int)g.Key,
                    Items = g.Sum(p => p.Quantity ?? 1),
                    Grams = g.Sum(p => p.Weight * (p.Quantity ?? 1)),
                })
                .OrderByDescending(x => x.Grams)
                .ToList();

            var returned = returnedItems
                .GroupBy(ri => ri.KaratType)
                .Select(g => new PurityMovementRowVM
                {
                    KaratType = (int)g.Key,
                    Items = g.Sum(ri => ri.QuantityReturned),
                    Grams = g.Sum(ri => ri.Weight * ri.QuantityReturned),
                })
                .OrderByDescending(x => x.Grams)
                .ToList();

            var vm = new PurityMovementVM { Added = added, Returned = returned };

            return new GenericResponse<PurityMovementVM>
            {
                Data = vm,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
