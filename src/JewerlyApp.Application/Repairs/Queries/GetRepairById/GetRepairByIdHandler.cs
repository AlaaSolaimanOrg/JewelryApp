using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Repairs.Dtos;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairById
{
    public class GetRepairByIdHandler : IRequestHandler<GetRepairByIdQuery, GenericResponse<RepairDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetRepairByIdHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<RepairDto>> Handle(GetRepairByIdQuery request, CancellationToken cancellationToken)
        {
            var repair = await _context.Repairs
                .Include(r => r.Customer)
                .Include(r => r.Items)
                .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

            if (repair == null)
            {
                return new GenericResponse<RepairDto>
                {
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.Error_Repair_Not_Found
                };
            }

            var repairDto = new RepairDto
            {
                Id = repair.Id,
                RepairCode = repair.RepairCode,
                CustomerId = repair.CustomerId,
                CustomerName = repair.Customer.Name,
                CustomerPhone = repair.Customer.PhoneNumber,
                OrderDate = repair.OrderDate,
                Status = repair.Status,
                TotalCost = repair.TotalCost,
                Items = repair.Items.Select(i => new RepairItemDto
                {
                    Id = i.Id,
                    ItemType = i.ItemType,
                    Metal = i.Metal,
                    Weight = i.Weight,
                    StoneType = i.StoneType,
                    RepairType = i.RepairType,
                    Notes = i.Notes,
                    Cost = i.Cost,
                    PaymentStatus = i.PaymentStatus,
                    DueDate = i.DueDate,
                }).ToList()
            };

            return new GenericResponse<RepairDto>
            {
                Data = repairDto,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
