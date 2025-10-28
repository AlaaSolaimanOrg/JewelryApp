using JewerlyApp.Application.Common.Messages;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Interfaces;
using JewerlyApp.Domain.Entities;
using JewerlyApp.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Customers.Commands.CreateCustomer
{
    public class CreateCustomerHandler : IRequestHandler<CreateCustomerCommand, GenericResponse<Guid>>
    {
        private readonly IApplicationDbContext _context;

        public CreateCustomerHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<GenericResponse<Guid>> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
        {
            var existingCustomer = await _context.Customers
                  .FirstOrDefaultAsync(c =>
        (!string.IsNullOrEmpty(request.Email) && c.Email == request.Email) ||
        (!string.IsNullOrEmpty(request.PhoneNumber) && c.PhoneNumber == request.PhoneNumber),
        cancellationToken);
            if (existingCustomer != null)
            {
                return new GenericResponse<Guid>
                {
                    StatusCode = ResponseStatusCode.BadRequest,
                    Message = Messages.Error_Customer_Data_Exists
                };
            }

            var customer = new Customer
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Birthday = request.Birthday,
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync(cancellationToken);

            return new GenericResponse<Guid>
            {
                Data = customer.Id,
                StatusCode = ResponseStatusCode.Created,
                Message = Messages.Success_Customer_Created
            };
        }
    }
}
