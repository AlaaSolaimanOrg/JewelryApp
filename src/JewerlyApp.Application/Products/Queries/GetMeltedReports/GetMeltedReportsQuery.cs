using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Products.Queries.GetMeltedReports
{
    public class GetMeltedReportsQuery : IRequest<GenericResponse<MeltedReportsVM>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
