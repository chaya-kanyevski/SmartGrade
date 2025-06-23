using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Models
{
    public class UserFile
    {
        public int Id { get; set; }
        public int UserId { get; set; } 
        public string Title { get; set; } = "";
        public string Type { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public long Size { get; set; } = 0;
        public string Tags { get; set; } = "";
        public string FilePath { get; set; } = "";
        public string Description { get; set; } = "";

        public UserFile()
        {

        }
        public UserFile(int id, int userId, string title, string type, int size, string tags, string filePath, string description)
        {
            Id = id;
            UserId = userId;
            Title = title;
            this.Type = type; 
            Size = size;
            Tags = tags; 
            FilePath = filePath;
            Description = description;
        }
    }
}
