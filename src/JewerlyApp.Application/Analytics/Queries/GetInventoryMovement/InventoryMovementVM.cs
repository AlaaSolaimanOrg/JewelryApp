namespace JewerlyApp.Application.Analytics.Queries.GetInventoryMovement
{
    public class InventoryMovementVM
    {
        public int AddedItems { get; set; }
        public decimal AddedGrams { get; set; }
        public int SoldItems { get; set; }
        public decimal SoldGrams { get; set; }
        public int ReturnedItems { get; set; }
        public decimal ReturnedGrams { get; set; }
        public decimal MeltedGrams { get; set; }
    }
}
