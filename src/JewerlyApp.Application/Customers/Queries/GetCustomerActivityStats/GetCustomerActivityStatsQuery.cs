using JewerlyApp.Domain.Enums;
using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Customers.Queries.GetCustomerActivityStats
{
    public class GetCustomerActivityStatsQuery : IDateRangeQuery, IRequest<GenericResponse<CustomerActivityStatsVM>>
    {
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }
        public ReportType? ReportType { get; set; }
    }
}
