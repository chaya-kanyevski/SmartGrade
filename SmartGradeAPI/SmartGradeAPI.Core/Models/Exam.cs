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
        public string UserId { get; set; }
        public string Subject { get; set; }
        public string Title { get; set; }
        public DateTime Created_at { get; set; } 
        public string Class { get; set; }
        public List<Question> Questions { get; set; }
        public List<Answer> Answers { get; set; }
        public List<ExamUpload> ExamsUpload { get; set; }

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
