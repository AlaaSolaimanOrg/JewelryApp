namespace JewerlyApp.Application.Common.Dtos
{
    public class CreateUserRequest
    {
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string Password { get; set; } = string.Empty;
        public IList<string> Roles { get; set; } = new List<string>();
    }

}
