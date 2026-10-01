using JewerlyApp.Domain.Enums;
using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairsByCustomer
{
    public class GetRepairsByCustomerQuery : IDateRangeQuery, IRequest<GenericResponse<List<CustomerRevenueVM>>>
    {
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }
        public ReportType? ReportType { get; set; }
        public string? Search { get; set; }
    }
}
