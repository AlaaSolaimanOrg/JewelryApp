using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Products.Commands.DeleteProduct
{
    public class DeleteProductCommand : IRequest<GenericResponse<string>>
    {
        public Guid Id {  get; set; }
    }
}
