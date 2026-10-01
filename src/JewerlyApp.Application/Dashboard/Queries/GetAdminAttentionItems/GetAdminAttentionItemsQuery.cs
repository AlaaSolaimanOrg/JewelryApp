using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Dashboard.Dtos;
using MediatR;
using System.Collections.Generic;

namespace JewerlyApp.Application.Dashboard.Queries.GetAdminAttentionItems
{
    public class GetAdminAttentionItemsQuery : IRequest<GenericResponse<List<AdminAttentionItemDto>>>
    {
    }
}
