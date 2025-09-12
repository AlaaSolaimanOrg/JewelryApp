using MediatR;
using JewerlyApp.Application.Common.Responses;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using JewerlyApp.Domain.Enums;

namespace JewerlyApp.Application.Products.Commands.EditProduct
{
    public record EditProductCommand : IRequest<GenericResponse<bool>>
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Sku { get; set; }
        public ProductCategory Category { get; set; }
        public ProductType Type { get; set; }
        public KaratType KaratType { get; set; }
        public string? Description { get; set; }
        public decimal Weight { get; set; }

        public List<IFormFile> Images { get; set; } = new List<IFormFile>();
    }
}
