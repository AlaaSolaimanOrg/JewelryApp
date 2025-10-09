using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Customers.Queries.GetCustomers;
using MediatR;

namespace JewerlyApp.Application.Customers.Queries.GetCustomer
{
    public class GetCustomerQuery :  IRequest<GenericResponse<GetCustomersVM>>
    {
        public string SearchBy {  get; set; }
    }
}
