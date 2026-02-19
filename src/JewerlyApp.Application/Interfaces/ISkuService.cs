using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Interfaces
{
    public interface ISkuService
    {
        Task<string> GenerateSkuAsync(ProductCategory category);
    }
}
