using JewerlyApp.Application.Common.Responses;
using MediatR;
using System.Collections.Generic;

namespace JewerlyApp.Application.Analytics.Queries.GetStockByPurity
{
    public class GetStockByPurityQuery : IRequest<GenericResponse<List<StockByPurityVM>>>
    {
    }
}
