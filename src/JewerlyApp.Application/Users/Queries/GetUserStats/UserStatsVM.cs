namespace JewerlyApp.Application.Users.Queries.GetUserStats
{
    public class UserStatsVM
    {
        public int TotalStaff { get; set; }
        public int ActiveStaff { get; set; }
        public int InactiveStaff { get; set; }
        public int AdminsCount { get; set; }
        public int TerminalsCount { get; set; }
    }
}
