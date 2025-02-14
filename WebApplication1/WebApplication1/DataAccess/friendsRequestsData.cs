using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace API.DataAccess
{
    public class friendsRequestsData : IfriendsRequestsData
    {
        AppDbContext _db;
        public friendsRequestsData(AppDbContext db)
        {
            _db = db;
        }

        public async Task SendfriendRequest(string senderId, string receiverId)
        {
            try
            {
                var checkForRequest = await _db.FriendsRequests.Where(x => x.senderId == senderId && x.receiverId == receiverId || x.senderId == receiverId && x.receiverId == senderId).FirstOrDefaultAsync();
                if (checkForRequest == null)
                {
                    var friendRequest = new FriendsRequests() { senderId = senderId, receiverId = receiverId };
                    await _db.FriendsRequests.AddAsync(friendRequest);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception ex) { }
        }

        public async Task AcceptFriendRequest(UserManager<AppUser> userManager, string senderId, string receiverId)
        {
            try
            {

                var checkForRequest = await _db.FriendsRequests.Where(x => x.senderId == senderId && x.receiverId == receiverId || x.senderId == receiverId && x.receiverId == senderId).FirstOrDefaultAsync();
                if (checkForRequest != null)
                {
                    var userSender = await userManager.FindByIdAsync(senderId);
                    var receiverUser = await userManager.FindByIdAsync(receiverId);

                    if (userSender.friendsId == null)
                    {
                        userSender.friendsId = new List<string>();
                    }
                    if (receiverUser.friendsId == null)
                    {
                        receiverUser.friendsId = new List<string>();
                    }

                    userSender.friendsId.Add(receiverId);
                    receiverUser.friendsId.Add(senderId);

                    await userManager.UpdateAsync(userSender);
                    await userManager.UpdateAsync(receiverUser);


                    _db.FriendsRequests.Remove(checkForRequest);
                    await _db.SaveChangesAsync();
                }

            }
            catch (Exception ex) { }
        }

        public async Task<List<FriendsRequests>> GetRequestsForMe(string receiverId)
        {
            try
            {
                return await _db.FriendsRequests
                    .Where(x => x.receiverId == receiverId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetRequestsForMe: {ex.Message}");

                return new List<FriendsRequests>();
            }
        }

        public async Task<List<FriendsRequests>> GetRequestsSendByMe(string senderId)
        {
            try
            {
                return await _db.FriendsRequests
                    .Where(x => x.senderId == senderId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetRequestsForMe: {ex.Message}");

                return new List<FriendsRequests>();
            }
        }

    }
}
