using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Products.Queries.GenerateSku
{
    public class GenerateSkuQuery : IRequest<GenericResponse<string>>
    {

        [Required]
        public ProductCategory Category { get; set; }
    }
}
