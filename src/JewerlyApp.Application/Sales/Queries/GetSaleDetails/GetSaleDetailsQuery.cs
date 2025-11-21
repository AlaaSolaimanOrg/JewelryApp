using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Products.Queries.GetQueryById;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetSaleById
{
    public class GetSaleDetailsQuery : IRequest<GenericResponse<GetSaleDetailsVM>>
    {
        public Guid? SaleId { get; set; }
        public string? SerialNumber { get; set; }
    }
}
