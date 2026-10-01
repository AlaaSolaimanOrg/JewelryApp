using JewerlyApp.Application.CashManagement.Dtos;
using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;

namespace JewerlyApp.Application.CashManagement.Queries.GetCashTransactions
{
    public class GetCashTransactionsQuery : SortedPaginatedQuery, IRequest<PaginatedResponse<CashTransactionDto>>
    {
        public CashBoxType? BoxType { get; set; }
        public string? SearchBy { get; set; }
    }
}
