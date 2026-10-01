using System.Collections.Generic;

namespace JewerlyApp.Application.Customers.Queries.GetCustomerTiers
{
    public class TierMemberVM
    {
        public string Name { get; set; } = string.Empty;
        public decimal Spent { get; set; }
        public int Purchases { get; set; }
    }

    public class CustomerTierVM
    {
        public string Name { get; set; } = string.Empty;
        public string MinLabel { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Total { get; set; }
        public List<TierMemberVM> Members { get; set; } = new();
    }
}
