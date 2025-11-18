using System;

namespace JewerlyApp.Application.Customers.Queries.GetCustomers
{
    public class GetCustomersVM
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateOnly? Birthday { get; set; }
        public int TotalProductsPurchased {  get; set; }
        public decimal? TotalPurchasesValue {  get; set; }
        public decimal? TotalDiscount { get; set; }
        public decimal Total18K { get; set; }
        public decimal Total21K { get; set; }
        public string? TestProp { get; set; }
    }
}
