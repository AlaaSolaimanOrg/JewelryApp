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

    public class KaratInventoryReportVM
    {
        public int KaratType { get; set; }
        public int ItemCount { get; set; }
        public decimal TotalWeight { get; set; }
    }

    public class MeltedReportsVM
    {
        public KaratInventoryReportVM[] Melted { get; set; } = Array.Empty<KaratInventoryReportVM>();
    }
}
