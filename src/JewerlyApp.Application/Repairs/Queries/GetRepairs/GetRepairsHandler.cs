using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Repairs.Dtos;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairs
{
    public class GetRepairsHandler : IRequestHandler<GetRepairsQuery, GenericResponse<List<RepairDto>>>
    {
        private readonly IApplicationDbContext _context;

        public GetRepairsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<List<RepairDto>>> Handle(GetRepairsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Repairs
                .Include(r => r.Customer)
                .Include(r => r.Items)
                .AsQueryable();

            if (request.Status.HasValue)
            {
                query = query.Where(r => r.Status == request.Status.Value);
            }

            var repairs = await query
                .OrderByDescending(r => r.OrderDate)
                .ToListAsync(cancellationToken);

            var repairDtos = repairs.Select(r => new RepairDto
            {
                Id = r.Id,
                CustomerId = r.CustomerId,
                CustomerName = r.Customer.Name,
                CustomerPhone = r.Customer.PhoneNumber,
                OrderDate = r.OrderDate,
                Status = r.Status,
                TotalCost = r.TotalCost,
                Notes = r.Notes,
                Items = r.Items.Select(i => new RepairItemDto
                {
                    Id = i.Id,
                    ItemType = i.ItemType,
                    Metal = i.Metal,
                    Weight = i.Weight,
                    StoneType = i.StoneType,
                    RepairType = i.RepairType,
                    Notes = i.Notes,
                    Cost = i.Cost,
                    UrgentFee = i.UrgentFee,
                    Discount = i.Discount,
                    PaymentStatus = i.PaymentStatus,
                    DueDate = i.DueDate,
                    SubTotal = i.SubTotal
                }).ToList()
            }).ToList();

            return new GenericResponse<List<RepairDto>>
            {
                Data = repairDtos,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
