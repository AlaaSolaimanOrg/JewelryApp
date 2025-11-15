using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Application.Products.Queries.GetQueryById;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Sales.Queries.GetSaleById
{
    internal class GetSaleByIdHandler : IRequestHandler<GetSaleByIdQuery, GenericResponse<GetSaleByIdVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetSaleByIdHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<GetSaleByIdVM>> Handle(GetSaleByIdQuery request, CancellationToken cancellationToken)
        {          
            var sale = await _context.Sales.Where(x => x.Id == request.SaleId)
                .Select(x => new GetSaleByIdVM
                {
                    Id = request.SaleId,
                    SerialNumber = 1,
                    CreatedDate = x.CreatedDate,
                    StaffName = x.CreatedByUser!.FullName!,
                    CustomerName = x.Customer!.Name,
                    Total = x.Total,
                    CashAmount = x.CashAmount,
                    CardAmount = x.CardAmount,
                    Discount =  x.Discount ,
                    SaleItems = x.SaleItems.Select(i => new SaleItemVM
                    {
                        ProductName = i.Product!.Name!,
                        Sku =  i.Product.Sku,
                        Karat = i.KaratType,
                        Weight = i.Weight,
                        PricePerGram = i.OverriddenPricePerGram ?? i.OriginalPricePerGram,
                        Subtotal = i.SubTotal,
                        Quantity = i.Quantity
                    }).ToList(),
                }).FirstOrDefaultAsync(cancellationToken);

            if (sale == null)
            {
                return new GenericResponse<GetSaleByIdVM>
                {
                    Data = null,
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = "Sale not found"
                };
            }

            return new GenericResponse<GetSaleByIdVM>
            {
                Data = sale,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
