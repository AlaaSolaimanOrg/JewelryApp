using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Products.Queries.GetMeltedProducts
{
    public class GetMeltedProductsQuery : IRequest<GenericResponse<MeltedProductsVM>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 25;
    }

    public class MeltedProductVM
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public string? Sku { get; set; }
        public string? ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal? Weight { get; set; }
        public int? KaratType { get; set; }
        public DateTime MeltedAt { get; set; }
    }

    public class MeltedProductsVM
    {
        public int TotalRecords { get; set; }
        public MeltedProductVM[] Items { get; set; } = Array.Empty<MeltedProductVM>();
    }
}
