using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Customers.Commands.UpdateCustomer
{
    public class UpdateCustomerCommand : IRequest<GenericResponse<string>>
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public DateOnly? Birthday { get; set; }
    }
}
