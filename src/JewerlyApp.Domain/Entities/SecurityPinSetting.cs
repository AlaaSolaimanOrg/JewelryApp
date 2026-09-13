using JewerlyApp.Domain.Entities.Common;
using System;

namespace JewerlyApp.Domain.Entities
{
    public class SecurityPinSetting : Entity<Guid>
    {
        public string Pin { get; set; } = default!;
    }
}
