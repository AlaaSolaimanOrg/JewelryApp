using JewerlyApp.Application.Common.Queries;
using System;
using System.Collections.Generic;
using MediatR;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;

namespace JewerlyApp.Application.Analytics.Queries.GetCustomerRetention
{
    public class GetCustomerRetentionQuery : IDateRangeQuery, IRequest<GenericResponse<List<CustomerRetentionVM>>>
    {
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }
        public ReportType? ReportType { get; set; } = null;
    }
}
