using JewerlyApp.Application.Common.Responses;
using MediatR;
using System.Collections.Generic;

namespace JewerlyApp.Application.Repairs.Queries.GetAvgRepairValueHistory
{
    public class GetAvgRepairValueHistoryQuery : IRequest<GenericResponse<List<AvgValueHistoryVM>>>
    {
    }
}
