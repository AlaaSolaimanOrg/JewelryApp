using JewerlyApp.Domain.Enums;
using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Sales.Queries.GetTopCustomers
{
    public class GetTopCustomersQuery : IDateRangeQuery, IRequest<GenericResponse<List<TopCustomerVM>>>
    {
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }
        public ReportType? ReportType { get; set; }
        public int Top { get; set; } = 5;
    }
}
