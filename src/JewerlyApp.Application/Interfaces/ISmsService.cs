using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Interfaces
{
    public interface ISmsService
    {
        Task SendAsync(string toPhoneNumber, string message);
    }

}
