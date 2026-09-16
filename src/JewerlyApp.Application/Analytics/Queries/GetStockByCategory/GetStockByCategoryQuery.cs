using JewerlyApp.Application.Common.Responses;
using MediatR;
using System.Collections.Generic;

namespace JewerlyApp.Application.Analytics.Queries.GetStockByCategory
{
    public class GetStockByCategoryQuery : IRequest<GenericResponse<List<StockByCategoryVM>>>
    {
    }
}
