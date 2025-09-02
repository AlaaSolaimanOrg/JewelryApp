using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Common.Responses
{
    public class PaginatedResponse<T> : GenericResponse<List<T>>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalRecords { get; set; }
        public int TotalPages { get => _totalRecords(); }


        private int _totalRecords()
        {
            if (PageSize == 0) return 0;
            return (int)Math.Ceiling((double)TotalRecords / PageSize);
        }
         
    }
}
