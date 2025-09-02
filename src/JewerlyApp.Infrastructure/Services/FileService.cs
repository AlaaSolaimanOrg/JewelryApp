using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using JewerlyApp.Infrastructure.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;

using System;
using JewerlyApp.Application.Common.Responses;
namespace JewerlyApp.Infrastructure.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        private readonly ApplicationDbContext _context;
        private readonly List<string> _allowedExtensions = new() { ".jpg", ".jpeg", ".png", ".gif", ".bmp" };
        private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB

        public FileService(IHostingEnvironment environment, ApplicationDbContext context)
        {
            _environment = environment;
            _context = context;
        }

        public async Task<List<ProductImage>> UploadProductImagesAsync(Guid productId, KaratType karatType, List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                throw new ArgumentException("No files uploaded.");

            var karatFolder = karatType == KaratType.Karat18 ? "18K" : "21K";
            var imagesFolder = Path.Combine(_environment.WebRootPath, "images", "products", karatFolder);
            Directory.CreateDirectory(imagesFolder);

            var productImages = new List<ProductImage>();
            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            for (int i = 0; i < files.Count; i++)
            {
                var file = files[i];
                var extension = Path.GetExtension(file.FileName);
                var sku = _context.Products.Where(p => p.Id == productId).Select(p => p.Sku).FirstOrDefault();

                var fileName = $"product-{sku}-{timestamp}-{i + 1}{extension}";
                var filePath = Path.Combine(imagesFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var productImage = new ProductImage
                {
                    ProductId = productId,
                    ImageUrl = $"/images/products/{karatFolder}/{fileName}",
                    IsMain = i == 0,  // First image as main by default
                    CreatedDate = DateTime.UtcNow
                };

                productImages.Add(productImage);
            }

            _context.ProductImages.AddRange(productImages);
            await _context.SaveChangesAsync();

            return productImages;
        }


        /// <summary>
        /// Validates a list of image files.
        /// </summary>
        /// <param name="files">List of uploaded files.</param>
        /// <returns>GenericResponse containing validation errors, or Success if valid.</returns>
        public GenericResponse<List<string>> ValidateImageFiles(List<IFormFile> files)
        {
            var errors = new List<string>();

            if (files == null || files.Count == 0)
            {
                errors.Add("No files uploaded.");
            }
            else
            {
                foreach (var file in files)
                {
                    var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

                    if (!_allowedExtensions.Contains(extension))
                        errors.Add($"File '{file.FileName}' has an invalid extension. Only images are allowed.");

                    if (file.Length > MaxFileSizeBytes)
                        errors.Add($"File '{file.FileName}' exceeds the 5MB size limit.");

                    if (!file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                        errors.Add($"File '{file.FileName}' is not a valid image.");

                    // Optional: check dimensions
                    // using var img = Image.FromStream(file.OpenReadStream());
                    // if (img.Width < 50 || img.Height < 50)
                    //     errors.Add($"File '{file.FileName}' is too small. Minimum 50x50.");
                }
            }

            if (errors.Any())
            {
                return new GenericResponse<List<string>>
                {
                    Data = errors,
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = "Validation failed."
                };
            }

            return new GenericResponse<List<string>>
            {
                Data = null,
                StatusCode = ResponseStatusCode.Success,
                Message = "All files are valid."
            };
        }
    }
}
