using JewerlyApp.Application.Common.Dtos;
using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Products.Queries.GetProducts;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Auth.Queries.GetAllUsers
{
    public class GetAllUsersQuery : SortedPaginatedQuery, IRequest<PaginatedResponse<UserDto>>
    {
        public string? SearchBy { get; set; }
        public string? Role { get; set; }
        public bool? IsActive { get; set; }
    }
}
