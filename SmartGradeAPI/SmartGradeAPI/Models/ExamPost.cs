namespace SmartGradeAPI.API.Models
{
    public class ExamPost
    {
        public int UserId { get; set; }
        public string Subject { get; set; }
        public string Title { get; set; }
        public string Class { get; set; }
        public string ExampleExamPath { get; set; }
    }
}
