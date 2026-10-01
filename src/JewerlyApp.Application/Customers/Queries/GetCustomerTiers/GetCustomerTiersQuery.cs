using JewerlyApp.Application.Common.Responses;
using MediatR;
using System.Collections.Generic;

namespace JewerlyApp.Application.Customers.Queries.GetCustomerTiers
{
    public class GetCustomerTiersQuery : IRequest<GenericResponse<List<CustomerTierVM>>>
    {
    }
}
