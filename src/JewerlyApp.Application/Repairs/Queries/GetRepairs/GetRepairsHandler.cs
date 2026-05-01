using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Repairs.Dtos;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairs
{
    public class GetRepairsHandler : IRequestHandler<GetRepairsQuery, PaginatedResponse<RepairDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetRepairsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResponse<RepairDto>> Handle(GetRepairsQuery request, CancellationToken cancellationToken)
        {
            IQueryable<Repair> query = _context.Repairs
                .Include(r => r.Customer)
                .AsNoTracking();

            /* =============================
                    APPLY FILTERS HERE
            ============================== */
            query = ApplyFilters(query, request);

            /* =============================
                    TOTAL RECORD COUNT
            ============================== */
            int totalRecords = await query.CountAsync(cancellationToken);

            /* =============================
                        PAGINATION
            ============================== */
            var paginatedRepairs = await query
                .ApplySorting(request.SortBy, request.SortDirection)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            /* =============================
                        MAP TO DTO
            ============================== */
            var result = paginatedRepairs.Select(r => new RepairDto
            {
                Id = r.Id,
                RepairCode = r.RepairCode,
                CustomerId = r.CustomerId,
                CustomerName = r.Customer.Name,
                CustomerPhone = r.Customer.PhoneNumber,
                OrderDate = r.OrderDate,
                Status = r.Status,
                Notes = r.Notes,
                Cost = r.Cost,
                PaymentStatus = r.PaymentStatus,
                DueDate = r.DueDate,
                SlotNumber = r.SlotNumber,
                ReceiverName = r.ReceiverName,
            }).ToList();

            return new PaginatedResponse<RepairDto>
            {
                Data = result,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = totalRecords,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }

        /* ==========================================================
                          FILTER METHOD
           (Status, RepairType, Search)
        =========================================================== */
        private IQueryable<Repair> ApplyFilters(IQueryable<Repair> query, GetRepairsQuery request)
        {
            /* =============================
                 FILTER BY STATUS
            ============================== */
            if (request.Status.HasValue)
            {
                query = query.Where(r => r.Status == request.Status.Value);
            }

            /* =============================
                     SEARCH FILTER
               (name, phone, notes)
            ============================== */
            if (!string.IsNullOrWhiteSpace(request.SearchBy))
            {
                var s = request.SearchBy.ToLower();

                query = query.Where(r =>
                    r.Customer.Name.ToLower().Contains(s) ||
                    r.Customer.PhoneNumber.Contains(s) ||
                    r.RepairCode.Contains(s));
            }

            return query;
        }
    }
}
