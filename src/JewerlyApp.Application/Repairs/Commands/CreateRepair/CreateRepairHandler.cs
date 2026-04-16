using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
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

            var nextRepairCode = await GenerateRepairCodeAsync(cancellationToken);

            var deposit = request.PaymentStatus == PaymentStatus.Paid ? request.Cost : 0;

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
