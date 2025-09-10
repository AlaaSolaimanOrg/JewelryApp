using JewerlyApp.Application.Common.Queries;
using JewerlyApp.Application.Common.Responses;
using JewerlyApp.Application.Products.Queries.GetProducts;
using JewerlyApp.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Products.Queries.GetQueryById
{

    public class GetProductByIdQuery : IRequest<GenericResponse<GetProductsVM>>
    {
        public Guid Id { get; set; }
        public string? SearchBy { get; set; }
     

    }
}
