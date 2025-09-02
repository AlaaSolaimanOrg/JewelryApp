using JewerlyApp.Application.Common.Responses;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Products.Commands.ValidateProductImages
{
    public class ValidateProductImagesCommand : IRequest<GenericResponse<List<string?>>>
    {
        public List<IFormFile> Images { get; set; } = new();
    }
}
