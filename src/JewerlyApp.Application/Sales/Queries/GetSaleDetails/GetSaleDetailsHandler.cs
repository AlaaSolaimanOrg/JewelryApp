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
    internal class GetSaleDetailsHandler : IRequestHandler<GetSaleDetailsQuery, GenericResponse<GetSaleDetailsVM>>
    {
        private readonly IApplicationDbContext _context;

        public GetSaleDetailsHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<GetSaleDetailsVM>> Handle(GetSaleDetailsQuery request, CancellationToken cancellationToken)
        {
            var saleQuery = _context.Sales.AsQueryable();

            if (request.SaleId != null)
            {
                saleQuery = saleQuery.Where(x => x.Id == request.SaleId);
            }
            else if (!string.IsNullOrWhiteSpace(request.SerialNumber))
            {
                saleQuery = saleQuery.Where(x => x.SerialNumber == request.SerialNumber);
            }
            else
            {
                return new GenericResponse<GetSaleDetailsVM>
                {
                    Data = null!,
                    Message = "SaleId or SerialNumber is required.",
                    StatusCode = ResponseStatusCode.BadRequest
                };
            }

            var sale = await saleQuery
                .Select(x => new GetSaleDetailsVM
                {
                    Id = x.Id,
                    SerialNumber = x.SerialNumber,
                    CreatedDate = x.CreatedDate,
                    StaffName = x.CreatedByUser!.FullName!,
                    CustomerName = x.Customer!.Name,
                    CustomerPhone = x.Customer!.PhoneNumber,
                    Total = x.Total,
                    CashAmount = x.CashAmount,
                    CardAmount = x.CardAmount,
                    Discount = x.Discount,
                    SaleItems = x.SaleItems.Select(i => new SaleItemVM
                    {
                        ProductName = i.Product!.Name!,
                        Sku = i.Product.Sku,
                        Karat = i.KaratType,
                        Weight = i.Weight,
                        PricePerGram = i.OverriddenPricePerGram ?? i.OriginalPricePerGram,
                        Subtotal = i.SubTotal,
                        Quantity = i.Quantity
                    }).ToList(),
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (sale == null)
            {
                return new GenericResponse<GetSaleDetailsVM>
                {
                    Data = null,
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = "Sale not found"
                };
            }

            return new GenericResponse<GetSaleDetailsVM>
            {
                Data = sale,
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success,
            };
        }
    }
}
