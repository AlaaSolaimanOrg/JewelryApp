using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Customers.Queries.GetCustomerPurchaseHistory
{
    public class GetCustomerPurchaseHistoryQuery : IRequest<GenericResponse<List<PurchaseHistoryVm>>>
    {
        public Guid CustomerId { get; set; }
    }
}
