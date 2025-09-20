using JewerlyApp.Application.Common.Dtos;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Products.Queries.GetProducts;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Auth.Queries.GetAllUsers
{
    public class GetAllUsersHandler : IRequestHandler<GetAllUsersQuery, PaginatedResponse<UserDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserManagementService _userManagementService;

        public GetAllUsersHandler(IApplicationDbContext context, IUserManagementService userManagementService)
        {
            _context = context;
            _userManagementService = userManagementService;
        }

        public async Task<PaginatedResponse<UserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
        {
            var respone = await _userManagementService.GetAllUsersAsync(request, cancellationToken);

            return respone;
        }
    }
}
