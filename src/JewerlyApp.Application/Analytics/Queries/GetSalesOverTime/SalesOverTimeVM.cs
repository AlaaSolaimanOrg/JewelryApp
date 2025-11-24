using System;

namespace JewerlyApp.Application.Analytics.Queries.GetSalesOverTime
{
    public class SalesOverTimeVM
    {
        public string DateLabel { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public decimal Revenue { get; set; }
        public int UnitsSold { get; set; }
    }
}
