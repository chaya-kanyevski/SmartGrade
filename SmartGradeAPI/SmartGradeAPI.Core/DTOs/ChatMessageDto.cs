using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.DTOs
{
    public class ChatMessageDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }

        public int SenderId { get; set; }
        public string SenderName { get; set; } = string.Empty;
    }

}