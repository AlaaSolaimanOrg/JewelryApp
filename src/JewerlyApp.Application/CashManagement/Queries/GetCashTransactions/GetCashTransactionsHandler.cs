using JewerlyApp.Application.CashManagement.Dtos;
using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.CashManagement.Queries.GetCashTransactions
{
    public class GetCashTransactionsHandler : IRequestHandler<GetCashTransactionsQuery, PaginatedResponse<CashTransactionDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetCashTransactionsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResponse<CashTransactionDto>> Handle(GetCashTransactionsQuery request, CancellationToken cancellationToken)
        {
            IQueryable<CashTransaction> query = _context.CashTransactions
                .Include(t => t.Sale)
                .Include(t => t.CreatedByUser)
                .AsNoTracking();

            query = ApplyFilters(query, request);

            int totalRecords = await query.CountAsync(cancellationToken);

            var sortBy = string.IsNullOrWhiteSpace(request.SortBy) ? nameof(CashTransaction.CreatedDate) : request.SortBy;

            var paginated = await query
                .ApplySorting(sortBy, request.SortDirection)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var result = paginated.Select(t => new CashTransactionDto
            {
                Id = t.Id,
                BoxType = t.BoxType,
                Type = t.Type,
                Amount = t.Amount,
                IsCredit = CashTransactionTypeHelper.IsCredit(t.Type),
                Category = t.Category,
                CustomerName = t.CustomerName,
                Destination = t.Destination,
                Notes = t.Notes,
                SaleId = t.SaleId,
                SaleSerialNumber = t.Sale?.SerialNumber,
                CreatedByName = t.CreatedByUser?.UserName,
                CreatedDate = t.CreatedDate,
            }).ToList();

            return new PaginatedResponse<CashTransactionDto>
            {
                Data = result,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalRecords = totalRecords,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }

        private IQueryable<CashTransaction> ApplyFilters(IQueryable<CashTransaction> query, GetCashTransactionsQuery request)
        {
            if (request.BoxType.HasValue)
            {
                query = query.Where(t => t.BoxType == request.BoxType.Value);
            }

            if (!string.IsNullOrWhiteSpace(request.SearchBy))
            {
                var s = request.SearchBy.ToLower();

                query = query.Where(t =>
                    (t.Category != null && t.Category.ToLower().Contains(s)) ||
                    (t.CustomerName != null && t.CustomerName.ToLower().Contains(s)) ||
                    (t.Destination != null && t.Destination.ToLower().Contains(s)) ||
                    (t.Notes != null && t.Notes.ToLower().Contains(s)) ||
                    (t.Sale != null && t.Sale.SerialNumber.ToLower().Contains(s)));
            }

            return query;
        }
    }
}
