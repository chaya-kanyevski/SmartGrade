using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Models
{
    public class FileUpload
    {
        public int Id { get; set; }
        public int SubmissionNumber { get; set; } 
        public int UserId { get; set; }
        public int? FileId { get; set; }
        public string StudentName { get; set; }
        public string FilePath { get; set; }
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;
        public int Score { get; set; }

        public FileUpload()
        {

        }

        public FileUpload(int id, int userId, int studentId, int fileId, string filePath, DateTime uploadDate, int score)
        {
            Id = id; 
            UserId = userId; 
            FileId = fileId;
            FilePath = filePath; 
            UploadDate = uploadDate; 
            Score = score;
        }
    }
}
