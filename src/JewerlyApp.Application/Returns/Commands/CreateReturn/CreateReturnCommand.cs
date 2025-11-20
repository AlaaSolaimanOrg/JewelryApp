using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Returns.Commands.CreateReturn
{
    public class CreateReturnCommand : IRequest<GenericResponse<string>>
    {
        public Guid SaleId { get; set; }
        public List<ReturnItemDto> Items { get; set; } = new();
    }
}
