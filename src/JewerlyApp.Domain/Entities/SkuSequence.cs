using JewerlyApp.Domain.Entities.Common;
using JewerlyApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JewerlyApp.Domain.Entities
{
    public class SkuSequence : Entity<Guid>
    {
        public ProductCategory Category { get; set; }
        public KaratType Karat { get; set; }
        public int Year { get; set; }
        public int LastNumber { get; set; }
    }
}
