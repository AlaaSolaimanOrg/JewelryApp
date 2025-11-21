using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs.Commands.UpdateRepair
{
    public class UpdateRepairHandler : IRequestHandler<UpdateRepairCommand, GenericResponse<Unit>>
    {
        private readonly IApplicationDbContext _context;

        public UpdateRepairHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<Unit>> Handle(UpdateRepairCommand request, CancellationToken cancellationToken)
        {
            var validationResult = await ValidateAndGetRepair(request, cancellationToken);
            if (validationResult.Response != null) return validationResult.Response;

            var repair = validationResult.Repair!;

            // Update Repair Details
            repair.Notes = request.Notes;

            // Update Items
            // 1. Identify items to delete (in DB but not in request)
            var requestItemIds = request.Items.Where(i => i.Id.HasValue).Select(i => i.Id!.Value).ToList();
            var itemsToDelete = repair.Items.Where(i => !requestItemIds.Contains(i.Id)).ToList();
            foreach (var item in itemsToDelete)
            {
                _context.RepairItems.Remove(item);
            }

            // 2. Update existing and Add new items
            foreach (var itemDto in request.Items)
            {
                if (itemDto.Id.HasValue)
                {
                    // Update existing
                    var existingItem = repair.Items.FirstOrDefault(i => i.Id == itemDto.Id.Value);
                    if (existingItem != null)
                    {
                        UpdateItem(existingItem, itemDto);
                    }
                }
                else
                {
                    // Add new
                    var newItem = new RepairItem
                    {
                        RepairId = repair.Id
                    };
                    UpdateItem(newItem, itemDto);
                    repair.Items.Add(newItem);
                }
            }

            // Recalculate TotalCost
            foreach (var item in itemsToDelete)
            {
                repair.Items.Remove(item);
            }
            
            repair.TotalCost = repair.Items.Sum(i => i.SubTotal);

            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<Unit>
            {
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success_Action,
                Data = Unit.Value
            };
        }

        private void UpdateItem(RepairItem item, UpdateRepairItemDto dto)
        {
            item.ItemType = dto.ItemType;
            item.Metal = dto.Metal;
            item.Weight = dto.Weight;
            item.StoneType = dto.StoneType;
            item.RepairType = dto.RepairType;
            item.Notes = dto.Notes;
            item.Cost = dto.Cost;
            item.UrgentFee = dto.UrgentFee;
            item.Discount = dto.Discount;
            item.DueDate = dto.DueDate;
            item.PaymentStatus = dto.PaymentStatus;
            item.SubTotal = dto.Cost + dto.UrgentFee - dto.Discount;
        }

        private async Task<(GenericResponse<Unit>? Response, Repair? Repair)> ValidateAndGetRepair(UpdateRepairCommand request, CancellationToken cancellationToken)
        {
            if (request.Items == null || !request.Items.Any())
            {
                return (new GenericResponse<Unit>
                {
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = Messages.Error_Repair_No_Items
                }, null);
            }

            var repair = await _context.Repairs
                .Include(r => r.Items)
                .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

            if (repair == null)
            {
                return (new GenericResponse<Unit>
                {
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.Error_Repair_Not_Found
                }, null);
            }

            return (null, repair);
        }
    }
}
