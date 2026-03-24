namespace JewerlyApp.Domain.Enums
{
    public enum PrintJobStatus
    {
        Pending = 0,
        Claimed = 1,
        Printing = 2,
        Printed = 3,
        Failed = 4
    }
}