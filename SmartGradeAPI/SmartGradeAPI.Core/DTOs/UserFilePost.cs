namespace SmartGradeAPI.Core.Models
{
    public class UserFilePost
    {
        public int UserId { get; set; }
        public string Title { get; set; }
        public string FilePath { get; set; }
        public string Tags { get; set; } 
        public string Description { get; set; }
        public string Type { get; set; } 
        public int Size { get; set; } 
    }
}
