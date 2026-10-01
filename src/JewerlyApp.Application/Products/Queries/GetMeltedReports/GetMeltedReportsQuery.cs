using JewerlyApp.Domain.Enums;
using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Products.Queries.GetMeltedReports
{
    public class GetMeltedReportsQuery : IDateRangeQuery, IRequest<GenericResponse<MeltedReportsVM>>
    {
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }
        public ReportType? ReportType { get; set; }
    }
}
