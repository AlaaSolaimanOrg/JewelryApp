using System.Collections.Generic;

namespace JewerlyApp.Application.Analytics.Queries.GetMovementByPurity
{
    public class PurityMovementRowVM
    {
        public int KaratType { get; set; }
        public int Items { get; set; }
        public decimal Grams { get; set; }
    }

    public class PurityMovementVM
    {
        public List<PurityMovementRowVM> Added { get; set; } = new();
        public List<PurityMovementRowVM> Returned { get; set; } = new();
    }
}
