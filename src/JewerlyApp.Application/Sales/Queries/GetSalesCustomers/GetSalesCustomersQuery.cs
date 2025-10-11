using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Sales.Queries.GetSoldItems;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetSalesCustomers
{
    public class GetSalesCustomersQuery : SortedPaginatedQuery, IRequest<PaginatedResponse<GetSalesCustomersVM>>
    {
        public CustomerFilter? CustomerFilter { get; set; }
        public string? SearchBy { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
