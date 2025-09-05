using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Shared;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Products.Queries.GenerateSku
{
    public class GenerateSkuHandler : IRequestHandler<GenerateSkuQuery, GenericResponse<string>>
    {
        private readonly ISkuService _skuService;

        public GenerateSkuHandler(ISkuService skuService)
        {
            _skuService = skuService;
        }

        public async Task<GenericResponse<string>> Handle(GenerateSkuQuery request, CancellationToken cancellationToken)
        {
            var sku = await _skuService.GenerateSkuAsync(request.Category, request.KaratType);

            return new GenericResponse<string>
            {
                Data = sku,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.successItemAdded
            };
        }
    }
}
