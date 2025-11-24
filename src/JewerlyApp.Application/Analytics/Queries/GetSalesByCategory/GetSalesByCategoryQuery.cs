using JewerlyApp.Domain.Enums;
using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Analytics.Queries.GetSalesByCategory
{
    public class GetSalesByCategoryQuery : IRequest<GenericResponse<List<SalesByCategoryVM>>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public ReportType ReportType { get; set; } = ReportType.Daily;
    }
}
