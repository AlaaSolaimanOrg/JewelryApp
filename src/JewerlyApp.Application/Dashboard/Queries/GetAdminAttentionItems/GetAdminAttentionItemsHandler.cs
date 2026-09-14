using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Dashboard.Dtos;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Dashboard.Queries.GetAdminAttentionItems
{
    public class GetAdminAttentionItemsHandler : IRequestHandler<GetAdminAttentionItemsQuery, GenericResponse<List<AdminAttentionItemDto>>>
    {
        private readonly IApplicationDbContext _context;

        public GetAdminAttentionItemsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<AdminAttentionItemDto>>> Handle(GetAdminAttentionItemsQuery request, CancellationToken cancellationToken)
        {
            var todayDate = BusinessTimeZoneHelper.GetEdmontonDate();

            var activeRepairs = await _context.Repairs
                .AsNoTracking()
                .Where(r => r.Status == RepairStatus.InProgress || r.Status == RepairStatus.Completed)
                .Select(r => new { r.Status, r.DueDate, r.Notified })
                .ToListAsync(cancellationToken);

            var overdueRepairs = activeRepairs
                .Where(r => r.Status == RepairStatus.InProgress && r.DueDate.HasValue && r.DueDate.Value < todayDate)
                .ToList();
            var awaitingCallCount = activeRepairs.Count(r => r.Status == RepairStatus.Completed && !r.Notified);

            var needsTagsCount = await _context.ReturnItems
                .AsNoTracking()
                .CountAsync(i => !i.IsTagPrinted && i.Option == ReturnOption.ReturnToStock, cancellationToken);

            var attention = new List<AdminAttentionItemDto>();

            if (overdueRepairs.Count > 0)
            {
                var oldestDueDate = overdueRepairs.Min(r => r.DueDate!.Value);
                var daysOverdue = todayDate.DayNumber - oldestDueDate.DayNumber;

                attention.Add(new AdminAttentionItemDto
                {
                    Color = "red",
                    Text = $"{overdueRepairs.Count} repair{(overdueRepairs.Count == 1 ? "" : "s")} overdue — oldest {daysOverdue} day{(daysOverdue == 1 ? "" : "s")}",
                    Tag = "Repairs",
                });
            }

            if (awaitingCallCount > 0)
            {
                attention.Add(new AdminAttentionItemDto
                {
                    Color = "amber",
                    Text = $"{awaitingCallCount} repair{(awaitingCallCount == 1 ? "" : "s")} done, customer not called yet",
                    Tag = "Call",
                });
            }

            if (needsTagsCount > 0)
            {
                attention.Add(new AdminAttentionItemDto
                {
                    Color = "blue",
                    Text = $"{needsTagsCount} returned item{(needsTagsCount == 1 ? "" : "s")} need tags printed",
                    Tag = "Tags",
                });
            }

            return GenericResponse<List<AdminAttentionItemDto>>.Success(attention);
        }
    }
}
