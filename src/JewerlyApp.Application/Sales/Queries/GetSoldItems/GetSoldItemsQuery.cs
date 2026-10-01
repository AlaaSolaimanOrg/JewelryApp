using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Sales.Queries.GetSalesList;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetSoldItems
{
    public class GetSoldItemsQuery : SortedPaginatedQuery, IDateRangeQuery, IRequest<PaginatedResponse<GetSoldItemsVM>>
    {
        public ProductCategory? CategoryFilter { get; set; }
        public KaratType? KaratFilter { get; set; }
        public DateOnly? DateFrom { get; set; }
        public DateOnly? DateTo { get; set; }
        public ReportType? ReportType { get; set; }
        public string? SearchBy { get; set; }
    }
}

