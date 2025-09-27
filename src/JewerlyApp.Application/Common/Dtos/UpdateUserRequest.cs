namespace JewerlyApp.Application.Common.Dtos
{
    public class UpdateUserRequest
    {
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public bool? IsActive { get; set; }
        public IList<string>? Roles { get; set; }
    }

}
