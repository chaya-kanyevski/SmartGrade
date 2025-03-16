using SmartGradeAPI.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.DTOs
{
    public class ReportDto
    {
        public DateTime DateGenerated { get; set; } = DateTime.Now;
        public List<Student> Students { get; set; }
    }
}
