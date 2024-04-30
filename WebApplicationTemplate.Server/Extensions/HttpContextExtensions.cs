using Microsoft.AspNetCore.Identity;
using WebApplicationTemplate.Server.Entities;

namespace WebApplicationTemplate.Server.Extensions
{
    public static class HttpContextExtensions
    {

        public static Task<User?> GetCurrentUser(this HttpContext context, UserManager<User> userManager)
        {
            string username = context.User.Identity?.Name ?? string.Empty;
        
            return userManager.FindByNameAsync(username);
        }
    }
}
