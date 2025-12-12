using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;

namespace JewerlyApp.Application.Products.Queries.ExportProductsToExcel
{
    public class ExportProductsToExcelQuery : IRequest<FileResponse>
    {
        public List<string>? SKUs { get; set; }
        public string? SearchBy { get; set; }
        public List<KaratType> KaratTypeFilter { get; set; } = new();
        public decimal? WeightFromFilter { get; set; }
        public decimal? WeightToFilter { get; set; }
        public decimal? PriceFromFilter { get; set; }
        public decimal? PriceToFilter { get; set; }
        public ProductCategory? ProductCategoryFilter { get; set; }
    }
}
