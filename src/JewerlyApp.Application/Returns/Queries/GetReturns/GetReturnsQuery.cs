using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;

namespace JewerlyApp.Application.Returns.Queries.GetReturns
{
    public class GetReturnsQuery : SortedPaginatedQuery, IRequest<PaginatedResponse<ReturnResponseDto>>
    {
        public string? SearchBy { get; set; }
        public ReturnOption? ReturnOption { get; set; }
    }
}
