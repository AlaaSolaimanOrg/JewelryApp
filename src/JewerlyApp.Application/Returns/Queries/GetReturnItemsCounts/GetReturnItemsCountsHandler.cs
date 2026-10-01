using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Returns.Queries.GetReturnItemsCounts
{
    internal class GetReturnItemsCountsHandler : IRequestHandler<GetReturnItemsCountsQuery, GenericResponse<ReturnItemsCountsDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetReturnItemsCountsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<ReturnItemsCountsDto>> Handle(GetReturnItemsCountsQuery request, CancellationToken cancellationToken)
        {
            var needsTags = await _context.ReturnItems
                .CountAsync(i => !i.IsTagPrinted && i.Option == ReturnOption.ReturnToStock, cancellationToken);
            var printed = await _context.ReturnItems
                .CountAsync(i => i.IsTagPrinted, cancellationToken);
            var all = await _context.ReturnItems.CountAsync(cancellationToken);

            return GenericResponse<ReturnItemsCountsDto>.Success(new ReturnItemsCountsDto
            {
                NeedsTags = needsTags,
                Printed = printed,
                All = all,
            });
        }
    }
}
