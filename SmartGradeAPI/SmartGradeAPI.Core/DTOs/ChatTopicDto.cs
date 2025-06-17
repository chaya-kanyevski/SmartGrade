using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.DTOs
{
    public class ChatTopicDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;

        public string AuthorName { get; set; } = string.Empty;
        public string AuthorInitials { get; set; } = "?";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int AuthorId { get; set; }
        public string? LastMessage { get; set; }
        public int MessageCount { get; set; }
    }

}
