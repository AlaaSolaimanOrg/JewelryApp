using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.Customers.Queries.GetCustomerBaseStats
{
    public class GetCustomerBaseStatsQuery : IRequest<GenericResponse<CustomerBaseStatsVM>>
    {
    }
}
