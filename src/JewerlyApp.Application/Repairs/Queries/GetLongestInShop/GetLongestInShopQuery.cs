using JewerlyApp.Application.Common.Responses;
using MediatR;
using System.Collections.Generic;

namespace JewerlyApp.Application.Repairs.Queries.GetLongestInShop
{
    public class GetLongestInShopQuery : IRequest<GenericResponse<List<LongestInShopVM>>>
    {
    }
}
