using JewerlyApp.Application.Common.Extensions;
using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JewerlyApp.Application.Logs.Queries.GetLogs
{
    internal class GetLogsHandler : IRequestHandler<GetLogsQuery, PaginatedResponse<GetLogsVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetLogsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResponse<GetLogsVM>> Handle(GetLogsQuery request, CancellationToken cancellationToken)
        {
            var query = from log in _context.Logs
                        join user in _context.Users on log.LoggedInUserId equals user.Id into userGroup
                        from user in userGroup.DefaultIfEmpty()
                        select new GetLogsVM
                        {
                            Id = log.Id,
                            HandlerName = log.HandlerName,
                            Request = log.Request,
                            Message = log.Message,
                            Exception = log.Exception,
                            Content = log.Content,
                            Level = log.Level,
                            LoggedInUserId = log.LoggedInUserId,
                            UserName = user != null ? user.UserName : null,
                            CorrelationId = log.CorrelationId,
                            CreatedAt = log.CreatedAt
                        };

            // Apply log level filter if specified
            if (request.LogLevel.HasValue)
            {
                query = query.Where(x => x.Level == request.LogLevel.Value);
            }

            if (!string.IsNullOrEmpty(request.SearchBy))
            {
                query = query.Where(x =>
                    x.HandlerName.Contains(request.SearchBy) ||
                    x.Message.Contains(request.SearchBy) ||
                    x.Exception!.Contains(request.SearchBy) ||
                    x.Content!.Contains(request.SearchBy) ||
                    (x.UserName != null && x.UserName.Contains(request.SearchBy)) ||
                    x.CorrelationId!.Contains(request.SearchBy));
            }

            var totalRecords = await query.CountAsync(cancellationToken);

            var logs = await query
                .ApplySorting(request.SortBy ?? "CreatedAt", request.SortDirection)
                .ApplyPagination(request.PageNumber, request.PageSize)
                .ToListAsync(cancellationToken);

            //throw new Exception("test alaa 3333");

            return new PaginatedResponse<GetLogsVM>
            {
                Data = logs,
                Message = Messages.LogsRetrievedSuccessfully,
                TotalRecords = totalRecords,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                StatusCode = logs.Any() ? ResponseStatusCode.Success : ResponseStatusCode.NoContent
            };
        }
    }
}
