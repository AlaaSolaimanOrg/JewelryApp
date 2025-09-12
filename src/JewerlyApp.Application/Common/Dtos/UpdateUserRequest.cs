namespace JewerlyApp.Application.Common.Dtos
{
    public class UpdateUserRequest
    {
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public bool? IsActive { get; set; }
        public IList<string>? Roles { get; set; }
    }

}
