using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Models
{
    public class ExamUpload
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int StudentId { get; set; }
        public int ExamId { get; set; }
        public string FilePath { get; set; }
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;
        public int Score { get; set; }

        public ExamUpload()
        {

        }

        public ExamUpload(int id, int userId, int studentId, int examId, string filePath, DateTime uploadDate, int score)
        {
            Id = id; 
            UserId = userId; 
            StudentId = studentId; 
            ExamId = examId;
            FilePath = filePath; 
            UploadDate = uploadDate; 
            Score = score;
        }
    }
}
