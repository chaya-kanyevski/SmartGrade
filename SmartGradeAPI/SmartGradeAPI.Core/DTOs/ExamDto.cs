using SmartGradeAPI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.DTOs
{
    public class ExamDto
    {
        public string Subject { get; set; }
        public string Title { get; set; }
        public string Class { get; set; }
    }
}
