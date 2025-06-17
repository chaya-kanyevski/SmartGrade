using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }

        public int ChatTopicId { get; set; }
        public ChatTopic ChatTopic { get; set; } = null!;

        public User Sender { get; set; } = null!; // קשר למשתמש המחבר

        public int SenderId { get; set; } // אם זה כפול ל-UserId – אולי מיותר
        public string Text { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }

    //public class ChatMessage
    //{
    //    public int Id { get; set; }

    //    public int ChatTopicId { get; set; }
    //    public int UserId { get; set; }
    //    public ChatTopic ChatTopic { get; set; } = null!;

    //    public int SenderId { get; set; }
    //    public string Text { get; set; } = string.Empty;
    //    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    //}

}
