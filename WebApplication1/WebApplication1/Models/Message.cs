namespace WebApplication1.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string? SenderId { get; set; }
        public string? ReciverId { get; set; }
        public string? Content { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsRead { get; set; }
        public AppUser? Sender { get; set; }
        public AppUser? Receiver { get; set; }
    }
}
