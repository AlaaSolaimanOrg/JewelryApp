using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.Customers.Queries.GetCustomers
{
    public class GetCustomersQuery : SortedPaginatedQuery, IRequest<PaginatedResponse<GetCustomersVM>>
    {
        public string? SearchBy {  get; set; }
    }
}
