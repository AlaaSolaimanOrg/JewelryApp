using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairsByCustomer
{
    public class GetRepairsByCustomerQuery : IRequest<GenericResponse<List<CustomerRevenueVM>>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public string? Search { get; set; }
    }
}
