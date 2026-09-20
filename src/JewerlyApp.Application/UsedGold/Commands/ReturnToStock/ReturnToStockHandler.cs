using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.UsedGold.Commands.ReturnToStock
{
    public class ReturnToStockHandler : IRequestHandler<ReturnToStockCommand, GenericResponse<string>>
    {
        private const decimal WeightTolerance = 0.01m;

        private readonly IApplicationDbContext _context;
        private readonly ISkuService _skuService;

        public ReturnToStockHandler(IApplicationDbContext context, ISkuService skuService)
        {
            _context = context;
            _skuService = skuService;
        }

        public async Task<GenericResponse<string>> Handle(ReturnToStockCommand request, CancellationToken cancellationToken)
        {
            if (request.Karat < 1 || request.Karat > 24)
                return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_StockReturn_InvalidKarat);

            if (request.Weight <= 0)
                return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_StockReturn_InvalidWeight);

            if (!Enum.IsDefined(typeof(KaratType), request.Karat))
                return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_StockReturn_UnsupportedKarat);

            if (string.IsNullOrWhiteSpace(request.Name))
                return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_StockReturn_NameRequired);

            if (!Enum.IsDefined(typeof(ProductCategory), request.Category))
                return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_StockReturn_InvalidCategory);

            var pools = await UsedGoldPoolCalculator.GetPoolsAsync(_context, cancellationToken);

            if (!pools.TryGetValue(request.Karat, out var pool) || pool.Weight <= 0 || request.Weight > pool.Weight + WeightTolerance)
                return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_StockReturn_InsufficientStock);

            var weight = Math.Min(request.Weight, pool.Weight);
            var avgCostPerGram = pool.Cost / pool.Weight;
            var cost = avgCostPerGram * weight;

            var stockReturn = new UsedGoldStockReturn
            {
                Id = Guid.NewGuid(),
                SerialNumber = await GenerateSerialNumber(),
                Karat = request.Karat,
                Weight = weight,
                Cost = cost,
                Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            };

            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = request.Name.Trim(),
                Sku = await _skuService.GenerateSkuAsync(request.Category),
                KaratType = (KaratType)request.Karat,
                Weight = weight,
                Category = request.Category,
                Type = ProductType.Gold,
                Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
                Quantity = 1,
            };

            _context.Products.Add(product);
            _context.UsedGoldStockReturns.Add(stockReturn);
            await _context.SaveChangesAsync(cancellationToken);

            return GenericResponse<string>.Created(product.Sku, Messages.Success_UsedGold_StockReturn_Created);
        }

        private async Task<string> GenerateSerialNumber()
        {
            string today = BusinessTimeZoneHelper.GetEdmontonDate().ToString("yyyyMMdd");
            string prefix = "UGR";

            int countToday = await _context.UsedGoldStockReturns
                .CountAsync(x => x.SerialNumber.StartsWith($"{prefix}-{today}"));

            return $"{prefix}-{today}-{(countToday + 1).ToString("D4")}";
        }
    }
}
