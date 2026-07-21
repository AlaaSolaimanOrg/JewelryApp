using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetSalesList
{
    public class GetSalesListVM
    {
        public Guid Id { get; set; }
        public string?  SerialNumber { get; set; }
        public DateTime?  CreatedDate { get; set; }
        public decimal  Total { get; set; }
        public bool CardPayment { get; set; }
        public bool CashPayment { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public decimal CashAmount { get; set; }
    }
}
