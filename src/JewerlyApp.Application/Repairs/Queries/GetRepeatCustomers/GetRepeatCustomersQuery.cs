using JewerlyApp.Application.Common.Responses;
using MediatR;
using System.Collections.Generic;

namespace JewerlyApp.Application.Repairs.Queries.GetRepeatCustomers
{
    public class GetRepeatCustomersQuery : IRequest<GenericResponse<List<RepeatCustomerVM>>>
    {
    }
}
