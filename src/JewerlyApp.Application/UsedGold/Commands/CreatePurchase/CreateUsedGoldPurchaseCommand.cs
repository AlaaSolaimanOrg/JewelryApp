using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.UsedGold.Commands.CreatePurchase
{
    public class CreateUsedGoldPurchaseCommand : IRequest<GenericResponse<string>>
    {
        public Guid CustomerId { get; set; }
        public UsedGoldPayMethod PayMethod { get; set; } = UsedGoldPayMethod.Cash;
        public string? Notes { get; set; }
        public List<UsedGoldPurchaseItemDto> Items { get; set; } = new();
    }
}
