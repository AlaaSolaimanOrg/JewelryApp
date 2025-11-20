using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Returns.Commands.CreateReturn
{
    public class ReturnItemDto
    {
        public Guid SaleItemId { get; set; }
        public int QuantityToReturn { get; set; }

        public ReturnReason Reason { get; set; }
        public string? ReasonNote { get; set; }
        public decimal ReturnAmount { get; set; }

        public ItemCondition Condition { get; set; }
        public ReturnOption Option { get; set; } 
    }

}
