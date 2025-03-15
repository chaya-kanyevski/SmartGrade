using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartGradeAPI.Core.Models
{
    public class Grade
    {
        public int Id { get; set; }
        public int StudentId { get; set; } 
        public int ExamId { get; set; } 
        public decimal Mark { get; set; }
    }
}
