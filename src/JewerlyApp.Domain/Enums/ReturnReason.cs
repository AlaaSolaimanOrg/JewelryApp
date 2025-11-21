using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Domain.Enums
{
    public enum ReturnReason
    {
        NotAsExpected = 1,
        WrongSize = 2,
        Defective = 3,
        GiftReturn = 4,
        Other = 99
    }
}
