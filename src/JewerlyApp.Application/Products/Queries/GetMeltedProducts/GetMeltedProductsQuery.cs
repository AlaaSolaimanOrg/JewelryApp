using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Products.Queries.GetMeltedProducts
{
    public class GetMeltedProductsQuery : SortedPaginatedQuery, IRequest<PaginatedResponse<MeltedProductVM>>
    {
        public string? SearchBy { get; set; }
    }
}
