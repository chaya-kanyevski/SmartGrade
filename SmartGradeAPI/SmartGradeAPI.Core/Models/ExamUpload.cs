using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Models
{
    public class ExamUpload
    {
        public int Id { get; set; }
        public int SubmissionNumber { get; set; } // מספר רץ אוטומטי לכל מבחן
        public int UserId { get; set; }
        public int? ExamId { get; set; }
        public string StudentName { get; set; }
        public string FilePath { get; set; }//הניתוב של הקובץ בעצמו מAWS
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;
        public int Score { get; set; }

        public ExamUpload()
        {

        }

        public ExamUpload(int id, int userId, int studentId, int examId, string filePath, DateTime uploadDate, int score)
        {
            Id = id; 
            UserId = userId; 
            ExamId = examId;
            FilePath = filePath; 
            UploadDate = uploadDate; 
            Score = score;
        }
    }
}
