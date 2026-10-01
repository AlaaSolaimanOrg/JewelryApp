using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Returns.Commands.MarkReturnItemsPrinted
{
    public class MarkReturnItemsPrintedHandler : IRequestHandler<MarkReturnItemsPrintedCommand, GenericResponse<string>>
    {
        private readonly IApplicationDbContext _context;

        public MarkReturnItemsPrintedHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<string>> Handle(MarkReturnItemsPrintedCommand request, CancellationToken cancellationToken)
        {
            if (request.ReturnItemIds == null || !request.ReturnItemIds.Any())
            {
                return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, "No return items were selected.");
            }

            var items = await _context.ReturnItems
                .Where(i => request.ReturnItemIds.Contains(i.Id) && i.Option == ReturnOption.ReturnToStock)
                .ToListAsync(cancellationToken);

            var printedAt = DateTime.UtcNow;
            foreach (var item in items)
            {
                item.IsTagPrinted = true;
                item.TagPrintedDate = printedAt;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return GenericResponse<string>.Success(items.Count.ToString(), Messages.Success);
        }
    }
}
