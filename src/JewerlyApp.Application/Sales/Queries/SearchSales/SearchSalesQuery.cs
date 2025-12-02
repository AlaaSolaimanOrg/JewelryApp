using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.Sales.Queries.SearchSales
{
    public class SearchSalesQuery : SortedPaginatedQuery, IRequest<PaginatedResponse<SearchSalesVM>>
    {
        public string? SerialNumber { get; set; }
        public string? CustomerPhone { get; set; }
        public string? CustomerName { get; set; }
    }
}
