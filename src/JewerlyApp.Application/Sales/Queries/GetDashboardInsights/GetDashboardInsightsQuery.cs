using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Sales.Queries.GetSalesInsights;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetDashboardInsights
{
    public class GetDashboardInsightsQuery : IRequest<GenericResponse<GetDashboardInsightsVM>>
    {
    }
}
