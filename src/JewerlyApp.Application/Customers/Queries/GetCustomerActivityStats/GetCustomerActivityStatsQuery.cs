using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Customers.Queries.GetCustomerActivityStats
{
    public class GetCustomerActivityStatsQuery : IRequest<GenericResponse<CustomerActivityStatsVM>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
