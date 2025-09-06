using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Products.Queries.GetProducts;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Products.Queries.GetQueryById
{
    public record GetProductByIdQuery(Guid Id) : IRequest<GenericResponse<GetProductsVM>>;
}
