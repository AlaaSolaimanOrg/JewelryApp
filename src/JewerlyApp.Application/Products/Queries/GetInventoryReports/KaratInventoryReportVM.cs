using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Products.Queries.GetInventoryReports
{
    public class KaratInventoryReportVM
    {
        public KaratType KaratType { get; set; }
        public int? ItemCount { get; set; }
        public decimal? TotalWeight { get; set; }
    }
}
