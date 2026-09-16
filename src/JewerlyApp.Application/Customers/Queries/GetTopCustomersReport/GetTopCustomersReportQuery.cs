using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Customers.Queries.GetTopCustomersReport
{
    public class GetTopCustomersReportQuery : IRequest<GenericResponse<List<CustomerReportRowVM>>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public string? Search { get; set; }
    }
}
