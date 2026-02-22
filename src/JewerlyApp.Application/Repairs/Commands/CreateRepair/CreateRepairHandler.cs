using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs.Commands.CreateRepair
{
    public class CreateRepairHandler : IRequestHandler<CreateRepairCommand, GenericResponse<Guid>>
    {
        private readonly IApplicationDbContext _context;

        public CreateRepairHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<Guid>> Handle(CreateRepairCommand request, CancellationToken cancellationToken)
        {
            // Validation
            var validationResult = await ValidateRepair(request, cancellationToken);
            if (validationResult != null) return validationResult;

            var nextRepairCode = await GenerateRepairCodeAsync(cancellationToken);

            var repairItems = request.Items.Select(itemDto =>
            {
                // calculate total item cost
                var total = itemDto.Cost + itemDto.UrgentFee - itemDto.Discount;

                // calculate deposit based on status
                var deposit = itemDto.PaymentStatus switch
                {
                    PaymentStatus.Unpaid => 0,
                    PaymentStatus.Paid => total,
                    PaymentStatus.Partial => itemDto.DepositPaid, 
                    _ => 0
                };

                return new RepairItem
                {
                    ItemType = itemDto.ItemType,
                    Metal = itemDto.Metal,
                    Weight = itemDto.Weight,
                    StoneType = itemDto.StoneType,
                    RepairType = itemDto.RepairType,
                    Notes = itemDto.Notes,
                    Cost = itemDto.Cost,
                    UrgentFee = itemDto.UrgentFee,
                    Discount = itemDto.Discount,
                    DueDate = itemDto.DueDate,
                    PaymentStatus = itemDto.PaymentStatus,

                    // ?? calculated deposit
                    DepositPaid = deposit,

                    // subtotal should remain unchanged (amount the item is worth)
                    SubTotal = total
                };
            }).ToList();


            var repair = new Repair
            {
                RepairCode = nextRepairCode,
                CustomerId = request.CustomerId,
                OrderDate = BusinessTimeZoneHelper.GetEdmontonDate(),
                Status = RepairStatus.InProgress,
                Notes = request.Notes,
                Items = repairItems,
                TotalCost = repairItems.Sum(i => i.SubTotal)

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

        private async Task<GenericResponse<Guid>?> ValidateRepair(CreateRepairCommand request, CancellationToken cancellationToken)
        {
            if (request.Items == null || !request.Items.Any())
            {
                return new GenericResponse<Guid>
                {
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = Messages.Error_Repair_No_Items
                };
            }

            var customerExists = await _context.Customers.AnyAsync(c => c.Id == request.CustomerId, cancellationToken);
            if (!customerExists)
            {
                return new GenericResponse<Guid>
                {
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.Error_Repair_Customer_Not_Found
                };
            }

            return null;
        }
        private async Task<string> GenerateRepairCodeAsync(CancellationToken cancellationToken)
        {
            // Example format: R-000123

            var lastCode = await _context.Repairs
                .OrderByDescending(r => r.CreatedDate) 
                .Select(r => r.RepairCode)
                .FirstOrDefaultAsync(cancellationToken);

            int number = 0;

            if (!string.IsNullOrWhiteSpace(lastCode) && lastCode.StartsWith("R-"))
            {
                int.TryParse(lastCode.Substring(2), out number);
            }

            number++;

            return $"R-{number.ToString("D6")}"; // R-000001
        }
    }
}
