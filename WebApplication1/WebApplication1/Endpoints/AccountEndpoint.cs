
using API.DataAccess;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Common;
using WebApplication1.DTOs;
using WebApplication1.Extensions;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Endpoints
{
    public static class AccountEndpoint
    {
        public static RouteGroupBuilder MapAccountEndpoint(this WebApplication app)
        {
            var group = app.MapGroup("/api/account").WithTags("account").DisableAntiforgery();

            group.MapPost("/register", async (HttpContext context, UserManager<AppUser> userManager, [FromForm] string fullName, [FromForm] string email, [FromForm] string password, [FromForm] string userName, [FromForm] IFormFile? profileImage) =>
            {
                var userFromDb = await userManager.FindByEmailAsync(email);
                if (userFromDb != null)
                {
                    return Results.BadRequest(Response<string>.Failure("User exists."));
                }

                if (profileImage is null)
                {
                    return Results.BadRequest(Response<string>.Failure("Profile image is required."));
                }

                var picture = await FileUpload.Upload(profileImage);
                picture = $"{context.Request.Scheme}://{context.Request.Host}/uploads/{picture}";

                var user = new AppUser
                {
                    Email = email,
                    FullName = fullName,
                    UserName = userName,
                    ProfileImage = picture
                };

                var result = await userManager.CreateAsync(user, password);

                if (!result.Succeeded)
                {
                    return Results.BadRequest(Response<string>.Failure(result.Errors.Select(x => x.Description).FirstOrDefault()!));
                }

                return Results.Ok(Response<string>.Success("", "User created"));
            });

            group.MapPost("/sendfriendrequest", async (UserManager<AppUser> userManager, IfriendsRequestsData friendsrequestdata, AddFriendDto dto) =>
            {
                if (dto is null)
                {
                    return Results.BadRequest(Response<string>.Failure("Invalid Id's details"));
                }

                await friendsrequestdata.SendfriendRequest(dto.senderId, dto.receiverId);
                return Results.Ok(Response<string>.Success("", "sended"));
            });

            group.MapPost("/acceptrequest", async (UserManager<AppUser> userManager, IfriendsRequestsData friendsrequestdata, AddFriendDto dto) =>
            {
                if (dto is null)
                {
                    return Results.BadRequest(Response<string>.Failure("Invalid Id's details"));
                }

                await friendsrequestdata.AcceptFriendRequest(userManager, dto.senderId, dto.receiverId);
                return Results.Ok(Response<string>.Success("", "sended"));
            });

            group.MapGet("/firendsrequestsforme", async (UserManager<AppUser> userManager, IfriendsRequestsData friendsrequestdata, string receiverId) =>
            {
                var requests = await friendsrequestdata.GetRequestsForMe(receiverId);
                return Results.Ok(Response<List<FriendsRequests>>.Success(requests!, "User fetched successfully!"));
            });

            group.MapGet("/firendsrequestssendbyme", async (UserManager<AppUser> userManager, IfriendsRequestsData friendsrequestdata, string senderId) =>
            {
                var requests = await friendsrequestdata.GetRequestsSendByMe(senderId);
                return Results.Ok(Response<List<FriendsRequests>>.Success(requests!, "User fetched successfully!"));
            });

            group.MapPost("/login", async (UserManager<AppUser> userManager, TokenService tokenService, LoginDto dto) =>
            {
                if (dto is null)
                {
                    return Results.BadRequest(Response<string>.Failure("Invalid login details"));
                }

                var user = await userManager.FindByEmailAsync(dto.Email);

            if (user is null)
                {
                    return Results.BadRequest(Response<string>.Failure("User not found"));
                }

            var result = await userManager.CheckPasswordAsync(user!, dto.Password);
                if (!result)
                {
                    return Results.BadRequest(Response<string>.Failure("Invalid password"));
                }

            var token = tokenService.GenerateToken(user.Id, user.UserName!);

                return Results.Ok(Response<string>.Success(token, "Login successfully"));
            });

            group.MapGet("/me", async (HttpContext context, UserManager<AppUser> userManager) =>
            {
                 var currentLoggedinUserId = context.User.GetUserId()!;
                var currentLoggedInUser = await userManager.Users.SingleOrDefaultAsync(x => x.Id == currentLoggedinUserId.ToString());

                return Results.Ok(Response<AppUser>.Success(currentLoggedInUser!,"User fetched successfully!"));

            }).RequireAuthorization();



            return group;
        }
    }
}
 