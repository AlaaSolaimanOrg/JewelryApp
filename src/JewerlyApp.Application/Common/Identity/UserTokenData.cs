using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Application.Common.Identity
{
    public class UserTokenData
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public IList<string> Roles { get; set; } = new List<string>();
    }
}
