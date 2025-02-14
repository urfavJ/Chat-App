using Microsoft.AspNetCore.Identity;

namespace WebApplication1.Models
{
    public class AppUser: IdentityUser
    {
        public string? FullName { get; set; }
        public string? ProfileImage { get; set; }
        public List<string>? friendsId { get; set; } = new List<string>();
    }
}
