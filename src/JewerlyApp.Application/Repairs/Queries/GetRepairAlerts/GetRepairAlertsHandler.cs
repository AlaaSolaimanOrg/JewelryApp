using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairAlerts
{
    public class GetRepairAlertsHandler : IRequestHandler<GetRepairAlertsQuery, GenericResponse<List<RepairAlertVM>>>
    {
        private readonly IApplicationDbContext _context;

        public GetRepairAlertsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<RepairAlertVM>>> Handle(GetRepairAlertsQuery request, CancellationToken cancellationToken)
        {
            var today = BusinessTimeZoneHelper.GetEdmontonDate();

            var active = await _context.Repairs
                .AsNoTracking()
                .Where(r => r.Status == RepairStatus.InProgress || r.Status == RepairStatus.Completed)
                .Select(r => new
                {
                    r.RepairCode,
                    CustomerName = r.Customer.Name,
                    r.Status,
                    r.DueDate,
                    r.Notified,
                    r.PaymentStatus,
                    r.Cost,
                })
                .ToListAsync(cancellationToken);

            var alerts = new List<RepairAlertVM>();

            foreach (var r in active)
            {
                if (r.Status == RepairStatus.InProgress && r.DueDate.HasValue && r.DueDate.Value < today)
                {
                    var diff = r.DueDate.Value.DayNumber - today.DayNumber; // negative when overdue
                    alerts.Add(new RepairAlertVM
                    {
                        RepairId = r.RepairCode,
                        Customer = r.CustomerName,
                        Message = $"Not repaired yet — {-diff} day{(-diff != 1 ? "s" : "")} past due date",
                        Cost = r.Cost,
                        Priority = 100 - diff,
                    });
                }
                else if (r.Status == RepairStatus.Completed && !r.Notified)
                {
                    alerts.Add(new RepairAlertVM
                    {
                        RepairId = r.RepairCode,
                        Customer = r.CustomerName,
                        Message = "Repaired — customer not called yet",
                        Cost = r.Cost,
                        Priority = 50,
                    });
                }
                else if (r.Status == RepairStatus.Completed && r.Notified)
                {
                    var unpaid = r.PaymentStatus == PaymentStatus.Unpaid;
                    alerts.Add(new RepairAlertVM
                    {
                        RepairId = r.RepairCode,
                        Customer = r.CustomerName,
                        Message = $"Customer notified — not picked up yet{(unpaid ? " (unpaid)" : "")}",
                        Cost = r.Cost,
                        Priority = unpaid ? 40 : 20,
                    });
                }
            }

            var sorted = alerts.OrderByDescending(a => a.Priority).ToList();

            return new GenericResponse<List<RepairAlertVM>>
            {
                Data = sorted,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
