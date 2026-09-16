using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Sales.Queries.GetTopCustomers
{
    public class GetTopCustomersQuery : IRequest<GenericResponse<List<TopCustomerVM>>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public int Top { get; set; } = 5;
    }
}
