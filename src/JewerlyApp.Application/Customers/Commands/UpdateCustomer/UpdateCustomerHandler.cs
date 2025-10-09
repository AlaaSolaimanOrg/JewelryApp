using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Customers.Commands.UpdateCustomer
{
    public class UpdateCustomerHandler : IRequestHandler<UpdateCustomerCommand, GenericResponse<string>>
    {
        private readonly IApplicationDbContext _context;

        public UpdateCustomerHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<string>> Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

            if (customer == null)
            {
                return new GenericResponse<string>
                {
                    StatusCode = ResponseStatusCode.NotFound,
                    Message = Messages.Error_Customer_Not_Found
                };
            }

            var duplicateCustomer = await _context.Customers
                .FirstOrDefaultAsync(c =>
                    c.Id != request.Id &&
                    (c.Email == request.Email || c.PhoneNumber == request.PhoneNumber),
                    cancellationToken);

            if (duplicateCustomer != null)
            {

                return new GenericResponse<string>
                {
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = Messages.Error_Customer_Data_Exists
                };
            }

            customer.Name = request.Name;
            customer.Email = request.Email;
            customer.PhoneNumber = request.PhoneNumber;
            customer.Birthday = request.Birthday;

            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<string>
            {
                StatusCode = ResponseStatusCode.Success,
                Message = Messages.Success_Customer_Updated
            };
        }
    }
}
