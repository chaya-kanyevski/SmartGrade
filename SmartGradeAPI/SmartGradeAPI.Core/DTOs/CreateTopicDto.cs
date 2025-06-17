using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.DTOs
{
    public class CreateTopicDto
    {
        public string Title { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string? InitialMessage { get; set; }
    }
}
