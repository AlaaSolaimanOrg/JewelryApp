using JewerlyApp.Application.Common.Responses;
using MediatR;
using System.Collections.Generic;

namespace JewerlyApp.Application.Repairs.Queries.GetRepairAlerts
{
    public class GetRepairAlertsQuery : IRequest<GenericResponse<List<RepairAlertVM>>>
    {
    }
}
