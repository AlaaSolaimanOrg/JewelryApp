using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.Returns.Queries.GetReturnItemsCounts
{
    public class GetReturnItemsCountsQuery : IRequest<GenericResponse<ReturnItemsCountsDto>>
    {
    }
}
