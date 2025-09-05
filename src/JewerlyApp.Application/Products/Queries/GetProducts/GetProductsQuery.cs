using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;

namespace JewerlyApp.Application.Products.Queries.GetProducts
{
    public class GetProductsQuery : SortedPaginatedQuery, IRequest<PaginatedResponse<GetProductsVM>>
    {
        public string? SearchBy { get; set; }
        public KaratType? KaratTypeFilter { get; set; }
        public decimal? WeightFilter { get; set; }
        public ProductCategory? ProductCategoryFilter { get; set; }

    }
}
