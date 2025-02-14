using System.Security.Claims;

namespace WebApplication1.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static string GetUserName(this ClaimsPrincipal user)
        {
            var username = user.FindFirstValue(ClaimTypes.Name) ?? throw new Exception("Xannot get username");
            return username;
        }

        public static Guid GetUserId(this ClaimsPrincipal user) {
            return Guid.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("Cannot get userid"));
        }
    }
}
