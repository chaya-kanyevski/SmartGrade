using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.DTOs
{
    public class ExamUploadDto
    {
        public int ExamId { get; set; }
        public string StudentName { get; set; }
        public string FilePath { get; set; }
    }
}
