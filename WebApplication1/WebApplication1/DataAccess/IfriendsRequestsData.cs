using API.Models;
using Microsoft.AspNetCore.Identity;
using WebApplication1.Models;

namespace API.DataAccess
{
    public interface IfriendsRequestsData
    {
        Task AcceptFriendRequest(UserManager<AppUser> userManager, string senderId, string receiverId);
        Task<List<FriendsRequests>> GetRequestsForMe(string receiverId);
        Task<List<FriendsRequests>> GetRequestsSendByMe(string senderId);
        Task SendfriendRequest(string senderId, string receiverId);
    }
}