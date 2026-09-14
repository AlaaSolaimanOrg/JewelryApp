using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Dashboard.Dtos;
using MediatR;

namespace JewerlyApp.Application.Dashboard.Queries.GetAdminSalesSummary
{
    public class GetAdminSalesSummaryQuery : IRequest<GenericResponse<AdminSalesSummaryDto>>
    {
    }
}
