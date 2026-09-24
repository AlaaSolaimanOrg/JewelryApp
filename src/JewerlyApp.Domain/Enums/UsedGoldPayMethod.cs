namespace JewerlyApp.Domain.Enums
{
    public enum UsedGoldPayMethod
    {
        Cash = 1,
        ETransfer = 2,
        // No cash actually moves — the gold's value is credited straight against a sale total.
        TradeIn = 3
    }
}
