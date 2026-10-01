using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Domain.Enums;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Sales.Queries.GetSalesList;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetSalesInsights
{
    public class GetSalesInsightsQuery : IDateRangeQuery, IRequest<GenericResponse<GetSalesInsightsVM>>
    {
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }
        public ReportType? ReportType { get; set; }
    }
}
