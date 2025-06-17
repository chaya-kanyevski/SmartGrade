using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.DTOs
{
    public class SendMessageDto
    {
        public int TopicId { get; set; }
        public int UserId { get; set; }
        public string Text { get; set; } = string.Empty;
    }

}
