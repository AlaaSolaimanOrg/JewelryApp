using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Interfaces
{
    public interface IFileService
    {
        Task<List<ProductImage>> UploadProductImagesAsync(Guid productId, KaratType karatType, List<IFormFile> files);

        GenericResponse<List<string>> ValidateImageFiles(List<IFormFile> files);
    }
}
