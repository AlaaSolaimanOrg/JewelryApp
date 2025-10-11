using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetSalesCustomers
{
    public class GetSalesCustomersVM
    {
        public Guid CustomerId { get; set; }
        public Guid SaleId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string NotesRemarks { get; set; } = string.Empty;
        public DateTime? CreatedDate { get; set; }
    }
}
