using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Models
{
    public class Exam
    {
        public int Id { get; set; }
        public int UserId { get; set; } 
        public string Subject { get; set; }
        public string Title { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Class { get; set; }
        public List<Question> Questions { get; set; }
        public string ExampleExamPath { get; set; } = "";
        public List<ExamUpload> ExamUploads { get; set; } = new List<ExamUpload>();

        public Exam()
        {

        }
        public Exam(int id, int userId, string subject, string title, DateTime created_at, string @class, List<Question> questions, List<ExamUpload> examsUpload)
        {
            Id = id;
            UserId = userId;
            Subject = subject;
            Title = title;
            CreatedAt = created_at;
            Class = @class;
            Questions = questions;
        }
    }
}
