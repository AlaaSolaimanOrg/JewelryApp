using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetTopSellingCategories
{
    public class GetTopSellingCategoriesVM
    {
        public string CategoryName { get; set; } = string.Empty;
        public KaratType Karat { get; set; }
        public int ItemsSold { get; set; }
        public decimal Revenue { get; set; }
        public decimal PercentageOfTotal { get; set; }
    }
}
