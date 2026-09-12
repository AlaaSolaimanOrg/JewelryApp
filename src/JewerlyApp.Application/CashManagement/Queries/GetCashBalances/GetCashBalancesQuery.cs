using JewerlyApp.Application.CashManagement.Dtos;
using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.CashManagement.Queries.GetCashBalances
{
    public class GetCashBalancesQuery : IRequest<GenericResponse<CashBalancesDto>>
    {
    }
}
