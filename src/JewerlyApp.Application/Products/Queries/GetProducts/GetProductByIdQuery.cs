using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Products.Queries.GetProducts
{
    public record GetProductByIdQuery(Guid Id) : IRequest<GenericResponse<GetProductsVM>>;
}
