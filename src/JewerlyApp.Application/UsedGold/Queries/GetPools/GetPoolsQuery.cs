using JewerlyApp.Application.Common.Responses;
using MediatR;
using System.Collections.Generic;

namespace JewerlyApp.Application.UsedGold.Queries.GetPools
{
    public class GetPoolsQuery : IRequest<GenericResponse<Dictionary<int, GoldPoolDto>>>
    {
    }
}
