using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Products.Commands.CreateProduct
{
    public class CreateProductCommand : IRequest<GenericResponse<string>>
    {
        public string? Name { get; set; }
        public string? Sku { get; set; }
        public ProductCategory Category { get; set; }
        public ProductType Type { get; set; }
        public KaratType KaratType { get; set; }
        public string? Description { get; set; }
        public decimal Weight { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater or equal to 1")]
        public int Quantity { get; set; } 

        public List<IFormFile> Images { get; set; }
    }
}
