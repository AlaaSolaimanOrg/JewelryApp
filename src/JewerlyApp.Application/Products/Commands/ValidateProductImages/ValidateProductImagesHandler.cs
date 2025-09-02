using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Products.Commands.ValidateProductImages
{
    public class ValidateProductImagesHandler : IRequestHandler<ValidateProductImagesCommand, GenericResponse<List<string>>>
    {
        private readonly IFileService _fileService;

        public ValidateProductImagesHandler(IFileService fileService)
        {
            _fileService = fileService;
        }

        public async Task<GenericResponse<List<string>>> Handle(ValidateProductImagesCommand request, CancellationToken cancellationToken)
        {
            var response = _fileService.ValidateImageFiles(request.Images);

            return response;
        }
    }
}
