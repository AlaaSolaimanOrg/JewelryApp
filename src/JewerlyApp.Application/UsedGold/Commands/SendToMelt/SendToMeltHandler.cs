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
            if (request.TotalWeight <= 0)
                return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_Melt_InvalidWeight);

            var pools = await UsedGoldPoolCalculator.GetPoolsAsync(_context, cancellationToken);
            var totalOnHand = pools.Values.Sum(p => p.Weight);

            if (totalOnHand <= 0 || request.TotalWeight > totalOnHand + WeightTolerance)
                return GenericResponse<string>.Error(ResponseStatusCode.BadRequest, Messages.Error_UsedGold_Melt_InsufficientStock);

            var bagWeight = Math.Min(request.TotalWeight, totalOnHand);
            var ratio = bagWeight / totalOnHand;

            var batch = new UsedGoldMeltBatch
            {
                Id = Guid.NewGuid(),
                SerialNumber = await GenerateSerialNumber(),
                TotalWeight = bagWeight,
                Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            };

            decimal totalCostRemoved = 0;
            foreach (var (karat, pool) in pools)
            {
                if (pool.Weight <= 0) continue;

                var weightRemoved = pool.Weight * ratio;
                var costRemoved = pool.Cost * ratio;
                totalCostRemoved += costRemoved;

                batch.Items.Add(new UsedGoldMeltBatchItem
                {
                    Id = Guid.NewGuid(),
                    MeltBatchId = batch.Id,
                    Karat = karat,
                    Weight = weightRemoved,
                    Cost = costRemoved,
                });
            }

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
