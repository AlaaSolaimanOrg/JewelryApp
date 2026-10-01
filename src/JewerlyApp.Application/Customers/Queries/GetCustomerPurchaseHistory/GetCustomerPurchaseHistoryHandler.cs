using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Customers.Queries.GetCustomerPurchaseHistory
{
    public class GetCustomerPurchaseHistoryQueryHandler
        : IRequestHandler<GetCustomerPurchaseHistoryQuery, GenericResponse<List<PurchaseHistoryVm>>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IUserService _userService;

        public GetCustomerPurchaseHistoryQueryHandler(IApplicationDbContext context, IUserService userService)
        {
            _context = context;
            _userService = userService;
        }

        public async Task<GenericResponse<List<PurchaseHistoryVm>>> Handle(GetCustomerPurchaseHistoryQuery request, CancellationToken cancellationToken)
        {
            var loggedInUser = await _userService.GetLoggedInUser();
            if (loggedInUser == null)
            {
                return new GenericResponse<List<PurchaseHistoryVm>>
                {
                    Data = null,
                    StatusCode = ResponseStatusCode.Unauthorized,
                    Message = Messages.ErrorGeneral
                };
            }

            var sales = await _context.Sales
                .AsNoTracking()
                .Where(s => s.CustomerId == request.CustomerId)
                .OrderByDescending(s => s.CreatedDate)
                .Select(s => new PurchaseHistoryVm
                {
                    SaleId = s.Id,
                    SerialNumber = s.SerialNumber,
                    PurchaseDate = (DateTime)s.CreatedDate,
                    ItemCount = s.SaleItems.Sum(si => (int?)si.Quantity) ?? 0,
                    Discount = s.Discount ?? 0,
                    TotalAmount = s.Total
                })
                .ToListAsync(cancellationToken);

            if (sales == null || sales.Count == 0)
            {
                return new GenericResponse<List<PurchaseHistoryVm>>
                {
                    Data = new List<PurchaseHistoryVm>(),
                    StatusCode = ResponseStatusCode.NoContent,
                    Message = Messages.Error_Purchase_Not_Found
                };
            }

            return new GenericResponse<List<PurchaseHistoryVm>>
            {
                Data = sales,
                StatusCode = ResponseStatusCode.Success,
                Message = "Successfully retrieved purchase history."
            };
        }
    }
}
