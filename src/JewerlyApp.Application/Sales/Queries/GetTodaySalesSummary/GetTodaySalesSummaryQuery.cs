using JewerlyApp.Application.Common.Responses;
using MediatR;

namespace JewerlyApp.Application.Sales.Queries.GetTodaySalesSummary
{
    public class GetTodaySalesSummaryQuery : IRequest<GenericResponse<TodaySalesSummaryDto>>
    {
        public string Pin { get; set; }
    }
}
