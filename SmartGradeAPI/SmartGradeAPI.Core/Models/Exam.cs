using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Models
{
    public class Exam
    {
        public int Id { get; set; } = 0;
        public string UserId { get; set; } = string.Empty;
        public string Subject { get; set; } = "";
        public string Title { get; set; } = "";
        public DateTime Created_at { get; set; } = DateTime.Now;
        public string Class { get; set; } = "";
        public List<Question> Questions { get; set; } = new List<Question>();
        public List<Answer> Answers { get; set; } = new List<Answer>();
        public List<ExamUpload> ExamsUpload { get; set; } = new List<ExamUpload>();

        public Exam()
        {

        }
        public Exam(int id, string userId, string subject, string title, DateTime created_at, string @class, List<Question> questions, List<Answer> answers, List<ExamUpload> examsUpload)
        {
            Id = id;
            UserId = userId;
            Subject = subject;
            Title = title;
            Created_at = created_at;
            Class = @class;
            Questions = questions;
            Answers = answers;
            ExamsUpload = examsUpload;
        }
    }
}
