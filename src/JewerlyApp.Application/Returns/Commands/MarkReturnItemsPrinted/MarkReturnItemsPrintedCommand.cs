using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Returns.Commands.MarkReturnItemsPrinted
{
    public class MarkReturnItemsPrintedCommand : IRequest<GenericResponse<string>>
    {
        public List<Guid> ReturnItemIds { get; set; } = new();
    }
}
