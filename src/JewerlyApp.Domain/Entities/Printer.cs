namespace JewerlyApp.Domain.Entities
{
    public class Printer
    {
        public Guid Id { get; set; }
        public string StoreId { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}