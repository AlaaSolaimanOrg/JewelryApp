using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.UsedGold.Queries.GetSummary
{
    public class GetSummaryQuery : IRequest<GenericResponse<UsedGoldSummaryDto>>
    {
        public string Pin { get; set; }
    }
}
