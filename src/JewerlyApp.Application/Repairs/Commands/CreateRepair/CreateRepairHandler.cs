using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs.Commands.CreateRepair
{
    public class CreateRepairHandler : IRequestHandler<CreateRepairCommand, GenericResponse<Guid>>
    {
        private readonly IApplicationDbContext _context;
        private readonly RepairSettings _repairSettings;

        public CreateRepairHandler(IApplicationDbContext context, IOptions<RepairSettings> repairSettings)
        {
            _context = context;
            _repairSettings = repairSettings.Value;
        }

        public async Task<GenericResponse<Guid>> Handle(CreateRepairCommand request, CancellationToken cancellationToken)
        {
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == request.CustomerId, cancellationToken);
            if (!customerExists)
            {
                return new GenericResponse<Guid>
                {
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.Error_Repair_Customer_Not_Found
                };
            }

            if (string.IsNullOrWhiteSpace(request.Notes))
            {
                return new GenericResponse<Guid>
                {
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = "Notes are required."
                };
            }

            var slotNumber = await AssignSlotNumberAsync(cancellationToken);
            if (slotNumber == null)
            {
                return new GenericResponse<Guid>
                {
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = Messages.Error_Repair_No_Slots_Available
                };
            }

            var nextRepairCode = await GenerateRepairCodeAsync(cancellationToken);

            var repair = new Repair
            {
                RepairCode = nextRepairCode,
                CustomerId = request.CustomerId,
                OrderDate = BusinessTimeZoneHelper.GetEdmontonDate(),
                Status = RepairStatus.InProgress,
                Notes = request.Notes,
                Cost = request.Cost,
                PaymentStatus = request.PaymentStatus,
                DueDate = request.DueDate,
                SlotNumber = slotNumber.Value,
            };

            _context.Repairs.Add(repair);
            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<Guid>
            {
                Data = repair.Id,
                StatusCode = ResponseStatusCode.Created,
                Message = Messages.Success_Repair_Created
            };
        }

        private async Task<int?> AssignSlotNumberAsync(CancellationToken cancellationToken)
        {
            var occupiedSlots = (await _context.Repairs
                .Where(r => r.Status != RepairStatus.PickedUp && r.SlotNumber != null)
                .Select(r => r.SlotNumber!.Value)
                .ToListAsync(cancellationToken))
                .ToHashSet();

            for (int slot = 1; slot <= _repairSettings.MaxSlots; slot++)
            {
                if (!occupiedSlots.Contains(slot))
                    return slot;
            }

            return null;
        }

        private async Task<string> GenerateRepairCodeAsync(CancellationToken cancellationToken)
        {
            var lastCode = await _context.Repairs
                .OrderByDescending(r => r.CreatedDate)
                .Select(r => r.RepairCode)
                .FirstOrDefaultAsync(cancellationToken);

            int number = 0;
            if (!string.IsNullOrWhiteSpace(lastCode) && lastCode.StartsWith("R-"))
                int.TryParse(lastCode.Substring(2), out number);

            number++;
            return $"R-{number:D6}";
        }
    }
}
