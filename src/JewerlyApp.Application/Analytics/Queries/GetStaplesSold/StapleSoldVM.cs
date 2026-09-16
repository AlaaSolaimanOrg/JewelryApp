namespace JewerlyApp.Application.Analytics.Queries.GetStaplesSold
{
    public class StapleSoldVM
    {
        public string Name { get; set; } = string.Empty;
        public string? Specification { get; set; }
        public int Stock { get; set; }
        public int Sold { get; set; }
        public bool IsLow { get; set; }
    }
}
