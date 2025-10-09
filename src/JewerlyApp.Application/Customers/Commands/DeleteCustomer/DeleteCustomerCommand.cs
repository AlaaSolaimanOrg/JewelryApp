using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;

namespace JewerlyApp.Application.Customers.Commands.DeleteCustomer
{
    public record DeleteCustomerCommand : IRequest<GenericResponse<string>>
    {
        public Guid Id { get; init; }
    }
}
