using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Products.Queries.GetInventoryReports;
using MediatR;
using System;

namespace JewerlyApp.Application.InventoryReports.Queries
{
    public class GetInventoryReportsQuery : IRequest<GenericResponse<InventoryReportsVM>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
