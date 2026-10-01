using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Users.Queries.GetUserStats
{
    public class GetUserStatsHandler : IRequestHandler<GetUserStatsQuery, GenericResponse<UserStatsVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetUserStatsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<UserStatsVM>> Handle(GetUserStatsQuery request, CancellationToken cancellationToken)
        {
            var totalStaff = await _context.Users.CountAsync(cancellationToken);
            var activeStaff = await _context.Users.CountAsync(u => u.IsActive, cancellationToken);

            var adminsCount = await (from u in _context.Users
                                      join ur in _context.UserRoles on u.Id equals ur.UserId
                                      join r in _context.Roles on ur.RoleId equals r.Id
                                      where r.Name == "Admin"
                                      select u.Id)
                                      .Distinct()
                                      .CountAsync(cancellationToken);

            var terminalsCount = await (from u in _context.Users
                                         join ur in _context.UserRoles on u.Id equals ur.UserId
                                         join r in _context.Roles on ur.RoleId equals r.Id
                                         where r.Name == "TerminalRole"
                                         select u.Id)
                                         .Distinct()
                                         .CountAsync(cancellationToken);

            return new GenericResponse<UserStatsVM>
            {
                Data = new UserStatsVM
                {
                    TotalStaff = totalStaff,
                    ActiveStaff = activeStaff,
                    InactiveStaff = totalStaff - activeStaff,
                    AdminsCount = adminsCount,
                    TerminalsCount = terminalsCount
                },
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success
            };
        }
    }
}
