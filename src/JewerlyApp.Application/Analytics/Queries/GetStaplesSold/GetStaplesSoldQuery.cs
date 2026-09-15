using JewerlyApp.Application.Common.Responses;
using MediatR;
using System;
using System.Collections.Generic;

namespace JewerlyApp.Application.Analytics.Queries.GetStaplesSold
{
    public class GetStaplesSoldQuery : IRequest<GenericResponse<List<StapleSoldVM>>>
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
