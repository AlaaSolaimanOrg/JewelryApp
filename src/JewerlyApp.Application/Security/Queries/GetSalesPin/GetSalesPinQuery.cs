using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.Security.Queries.GetSalesPin
{
    public class GetSalesPinQuery : IRequest<GenericResponse<string>>
    {
    }
}
