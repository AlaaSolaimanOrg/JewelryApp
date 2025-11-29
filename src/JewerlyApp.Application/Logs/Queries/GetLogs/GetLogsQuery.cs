using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Domain.Enums;
using MediatR;

namespace JewerlyApp.Application.Logs.Queries.GetLogs
{
    public class GetLogsQuery : SortedPaginatedQuery, IRequest<PaginatedResponse<GetLogsVM>>
    {
        public LogLevel? LogLevel { get; set; }
    }
}
