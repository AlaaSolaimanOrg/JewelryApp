using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;

namespace JewerlyApp.Application.Returns.Queries.GetReturnItems
{
    public class GetReturnItemsQuery : SortedPaginatedQuery, IRequest<PaginatedResponse<ReturnItemFlatDto>>
    {
        public string? SearchBy { get; set; }
        public ReturnItemsView View { get; set; } = ReturnItemsView.All;
    }
}
