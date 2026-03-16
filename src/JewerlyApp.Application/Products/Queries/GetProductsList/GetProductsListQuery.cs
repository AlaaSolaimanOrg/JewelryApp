using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;

namespace JewerlyApp.Application.Products.Queries.GetProducts
{
    public class GetProductsListQuery : SortedPaginatedQuery, IRequest<PaginatedResponse<GetProductsVM>>
    {
        public List<string>? SKUs { get; set; }
        public string? SearchBy { get; set; }
        public List<KaratType> KaratTypeFilter { get; set; } = new();
        public decimal? weightFromFilter { get; set; }
        public decimal? weightToFilter { get; set; }
        public decimal? PriceFromFilter { get; set; }
        public decimal? PriceToFilter { get; set; }
        public ProductCategory? ProductCategoryFilter { get; set; }

        public bool? InStock { get; set; }
    }
}
