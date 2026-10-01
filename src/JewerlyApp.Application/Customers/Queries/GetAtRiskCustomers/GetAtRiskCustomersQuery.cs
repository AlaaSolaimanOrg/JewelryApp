using JewerlyApp.Application.Common.Responses;
using MediatR;
using System.Collections.Generic;

namespace JewerlyApp.Application.Customers.Queries.GetAtRiskCustomers
{
    public class GetAtRiskCustomersQuery : IRequest<GenericResponse<List<AtRiskCustomerVM>>>
    {
    }
}
