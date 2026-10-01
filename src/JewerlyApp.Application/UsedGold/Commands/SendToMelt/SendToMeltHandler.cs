using JewerlyApp.Application.Common.Helpers;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.UsedGold.Commands.SendToMelt
{
    public class SendToMeltHandler : IRequestHandler<SendToMeltCommand, GenericResponse<string>>
    {
        private const decimal WeightTolerance = 0.5m;

        private readonly IApplicationDbContext _context;

        public SendToMeltHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<string>> Handle(SendToMeltCommand request, CancellationToken cancellationToken)
        {
            var items = (request.Items ?? new())
                .Where(i => i.Weight > 0)
                .GroupBy(i => i.Karat)
                .Select(g => new SendToMeltItemDto { Karat = g.Key, Weight = g.Sum(i => i.Weight) })
                .ToList();

            if (!items.Any())
                return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_Melt_NoItems);

            var pools = await UsedGoldPoolCalculator.GetPoolsAsync(_context, cancellationToken);

            foreach (var item in items)
            {
                if (!pools.TryGetValue(item.Karat, out var pool) || pool.Weight <= 0)
                    return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_Melt_InvalidKarat);

                if (item.Weight > pool.Weight + WeightTolerance)
                    return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_Melt_ItemExceedsPool);
            }

            var batch = new UsedGoldMeltBatch
            {
                Id = Guid.NewGuid(),
                SerialNumber = await GenerateSerialNumber(),
                Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            };

            decimal totalWeightRemoved = 0;
            decimal totalCostRemoved = 0;

            foreach (var item in items)
            {
                var pool = pools[item.Karat];
                var weightRemoved = Math.Min(item.Weight, pool.Weight);
                var costRemoved = pool.Weight > 0 ? pool.Cost * (weightRemoved / pool.Weight) : 0;

                totalWeightRemoved += weightRemoved;
                totalCostRemoved += costRemoved;

                batch.Items.Add(new UsedGoldMeltBatchItem
                {
                    Id = Guid.NewGuid(),
                    MeltBatchId = batch.Id,
                    Karat = item.Karat,
                    Weight = weightRemoved,
                    Cost = costRemoved,
                });
            }

            batch.TotalWeight = totalWeightRemoved;
            batch.TotalCost = totalCostRemoved;

            _context.UsedGoldMeltBatches.Add(batch);
            await _context.SaveChangesAsync(cancellationToken);

            return GenericResponse<string>.Created(batch.Id.ToString(), Messages.Success_UsedGold_Melt_Created);
        }

        private async Task<string> GenerateSerialNumber()
        {
            string today = BusinessTimeZoneHelper.GetEdmontonDate().ToString("yyyyMMdd");
            string prefix = "UGM";

            int countToday = await _context.UsedGoldMeltBatches
                .CountAsync(x => x.SerialNumber.StartsWith($"{prefix}-{today}"));

            return $"{prefix}-{today}-{(countToday + 1).ToString("D4")}";
        }
    }
}
