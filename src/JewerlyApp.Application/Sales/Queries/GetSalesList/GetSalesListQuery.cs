using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Sales.Queries.GetSaleById;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetSalesList
{
    public class GetSalesListQuery : SortedPaginatedQuery, IRequest<PaginatedResponse<GetSalesListVM>>
    {
        public string?  SearchBy { get; set; }
    }
}
