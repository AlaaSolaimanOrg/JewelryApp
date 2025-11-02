using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Commands.CreateSale
{
    public class CreateSaleCommand : IRequest<GenericResponse<string>>
    {
        public Guid CustomerId { get; set; }
        public decimal? Discount { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public DiscountType DiscountType { get; set; }
        public string? Note { get; set; }
        public decimal? CashAmount { get; set; }
        public decimal? CardAmount { get; set; }
        public List<SaleItemDto> SaleItems { get; set; } = new();
    }
}
