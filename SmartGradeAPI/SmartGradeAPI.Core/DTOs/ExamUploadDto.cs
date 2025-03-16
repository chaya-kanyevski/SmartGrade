using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.DTOs
{
    public class ExamUploadDto
    {
        public string FilePath { get; set; }
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;
        public int Score { get; set; }
    }
}
